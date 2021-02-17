import * as express from 'express';
import {Request, Response} from 'express';

import {currentUser} from '@ysaini_tickets/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    return res.send({currentUser: req.currentUser || null});
  }
);

export {router as currentUserRouter};
