import { IncomingMessage, ServerResponse } from 'http';
import { Authorize } from '../common/middleware/authorize';
import { ArtistService } from './artise.service';
import { asyncWrapper } from '../common/util/asyncWrapper';
import { sendResponse } from '../common/util/sendResponse';
import { getRequestBody } from '../common/util/requestUtils';
import { Role } from '../common/enum';
import { IArtist } from './artist';

export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private authorizeService: Authorize
  ) {}

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname;
    const id = path.split('/')[2];

    if (req.method === 'POST' && path === '/artists') {
      return asyncWrapper(this.createArtist.bind(this))(req, res);
    } else if (req.method === 'GET' && id) {
      return asyncWrapper(this.getArtistById.bind(this))(req, res);
    } else if (req.method === 'GET' && !id) {
      return asyncWrapper(this.getArtists.bind(this))(req, res);
    } else if (req.method === 'DELETE' && id) {
      return asyncWrapper(this.deleteArtist.bind(this))(req, res);
    } else if (req.method === 'PUT' && id) {
      return asyncWrapper(this.updateArtist.bind(this))(req, res);
    } else {
      sendResponse(res, 405, 'Method Not Allowed');
    }
  }

  async createArtist(req: IncomingMessage, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.ArtistManager])) return;

    const artist: IArtist = await getRequestBody(req);

    if (
      !artist.first_release_year ||
      !artist.no_of_albums_released ||
      !artist.first_name ||
      !artist.last_name ||
      !artist.email ||
      !artist.phone ||
      !artist.gender ||
      !artist.address ||
      !artist.password
    ) {
      sendResponse(res, 400, 'Missing required fields');
      return;
    }

    const newartist = await this.artistService.createArtise(artist);

    sendResponse(res, 201, 'Artist created successfully', newartist);
  }

  async getArtistById(req: IncomingMessage, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.ArtistManager])) return;

    const urlParts = req.url?.split('/');
    const id = urlParts ? urlParts[urlParts.length - 1] : null;

    const artist = await this.artistService.getArtiseById(id as string);

    if (!artist) {
      sendResponse(res, 404, 'Artist not found');
      return;
    }

    sendResponse(res, 200, 'artist find scccessfully', artist);
  }

  async getArtists(req: IncomingMessage, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.SuperAdmin, Role.ArtistManager])) return;

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    const artists = await this.artistService.getDetailsArtists(page, limit);

    sendResponse(res, 200, 'Artist find Sucessfully', {
      artists: artists,
      meta: artists.pagination,
    });
  }

  async deleteArtist(req: IncomingMessage, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.ArtistManager])) return;

    {
      const urlParts = req.url?.split('/');
      const id = urlParts ? urlParts[urlParts.length - 1] : null;
      const deletedartist = await this.artistService.deleteArtists(id as string);

      if (!deletedartist) {
        sendResponse(res, 404, 'artist not found');
        return;
      }
      sendResponse(res, 200, 'Artist deleted successfully', { id: deletedartist.id });
      return;
    }
  }

  async updateArtist(req: IncomingMessage, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.ArtistManager])) return;

    const urlParts = req.url?.split('/');
    const id = urlParts ? urlParts[urlParts.length - 1] : null;
    const artist = await getRequestBody(req);
    const updateartist = this.artistService.updateArtists(id as string, artist);
    if (!updateartist) {
      sendResponse(res, 404, 'artist not found');
    }
    sendResponse(res, 200, 'Artist update successfully', updateartist);
  }
}
