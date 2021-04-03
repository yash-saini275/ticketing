import * as express from 'express';
import {Request, Response} from 'express';
import {body} from 'express-validator';
import * as jwt from 'jsonwebtoken';
import {BadRequestError} from '@ysaini_tickets/common';

import {validateRequest} from '@ysaini_tickets/common';
import {User} from '../models/user';
import {Password} from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password').trim().notEmpty().withMessage('Password is required.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials.');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials.');
    }

    const token = jwt.sign(
      {id: existingUser._id, email: existingUser.email},
      process.env.JWT_KEY!
    );

    req.session = {jwt: token};
    return res.status(200).send(existingUser);
  }
);

export {router as signinRouter};
