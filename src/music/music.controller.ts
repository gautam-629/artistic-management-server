import { ServerResponse } from 'http';
import { AuthenticatedRequest, Authorize } from '../common/middleware/authorize';
import { MusicService } from './music.service';
import { sendResponse } from '../common/util/sendResponse';
import { asyncWrapper } from '../common/util/asyncWrapper';
import { getRequestBody } from '../common/util/requestUtils';
import { Role } from '../common/enum';
import { IMusic } from './music';

export class MusicController {
  constructor(
    private mucicsService: MusicService,
    private authorizeService: Authorize
  ) {}

  handleRequest(req: AuthenticatedRequest, res: ServerResponse) {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname;
    const id = path.split('/')[2];

    if (req.method === 'POST' && path === '/musics') {
      return asyncWrapper(this.createMusic.bind(this))(req, res);
    } else if (req.method === 'GET' && id) {
      return asyncWrapper(this.getMusicById.bind(this))(req, res);
    } else if (req.method === 'GET' && !id) {
      return asyncWrapper(this.getMusics.bind(this))(req, res);
    } else if (req.method === 'DELETE' && id) {
      return asyncWrapper(this.deleteMusic.bind(this))(req, res);
    } else if (req.method === 'PUT' && id) {
      return asyncWrapper(this.updateMusic.bind(this))(req, res);
    } else {
      sendResponse(res, 405, 'Method Not Allowed');
    }
  }

  async createMusic(req: AuthenticatedRequest, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.Artist])) return;
    const music: IMusic = await getRequestBody(req);

    const currentUser_id = req?.user?.id;
    if (!music.album_name || !music.album_name || !music.genre || !music.title) {
      sendResponse(res, 400, 'Missing required fields');
      return;
    }
    const newUser = await this.mucicsService.creatMusic({
      ...music,
      artist_id: Number(currentUser_id),
    });

    sendResponse(res, 201, 'Music created successfully', newUser);
  }

  async getMusicById(req: AuthenticatedRequest, res: ServerResponse) {
    if (
      !this.authorizeService.authorize(req, res, [Role.Artist, Role.ArtistManager, Role.SuperAdmin])
    )
      return;

    const urlParts = req.url?.split('/');
    const id = urlParts ? urlParts[urlParts.length - 1] : null;

    const music = await this.mucicsService.getmusicDetailsByid(id as string);

    if (!music) {
      sendResponse(res, 404, 'Music not found');
      return;
    }

    sendResponse(res, 200, 'Music find scccessfully', music);
  }

  async getMusics(req: AuthenticatedRequest, res: ServerResponse) {
    if (
      !this.authorizeService.authorize(req, res, [Role.Artist, Role.ArtistManager, Role.SuperAdmin])
    )
      return;

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    const musics = await this.mucicsService.getMusics(page, limit);

    sendResponse(res, 200, 'Music find Sucessfully', { musics: musics, meta: musics.pagination });
  }

  async deleteMusic(req: AuthenticatedRequest, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.Artist])) return;

    const currentUser_id = req?.user?.id;
    {
      const urlParts = req.url?.split('/');
      const id = urlParts ? urlParts[urlParts.length - 1] : null;
      const deletedUser = await this.mucicsService.deleteMusic(
        id as string,
        currentUser_id as string
      );

      if (!deletedUser) {
        sendResponse(res, 404, 'Music not found');
        return;
      }
      sendResponse(res, 200, 'Music deleted successfully', { id: deletedUser.id });
      return;
    }
  }

  async updateMusic(req: AuthenticatedRequest, res: ServerResponse) {
    if (!this.authorizeService.authorize(req, res, [Role.Artist])) return;
    const currentUser_id = req?.user?.id;
    const urlParts = req.url?.split('/');
    const id = urlParts ? urlParts[urlParts.length - 1] : null;
    const Music = await getRequestBody(req);
    const updateUser = this.mucicsService.updateMusic(
      id as string,
      Music,
      currentUser_id as string
    );
    if (!updateUser) {
      sendResponse(res, 404, 'Music not found');
    }
    sendResponse(res, 200, 'Music update successfully', updateUser);
  }
}
