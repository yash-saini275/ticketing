import * as express from 'express';

const router = express.Router();

router.post(
  '/api/users/signout',
  (req: express.Request, res: express.Response) => {
    req.session = null;

    return res.send({});
  }
);

export {router as signoutRouter};
