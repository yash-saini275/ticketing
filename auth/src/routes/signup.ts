import * as express from 'express';
import {body} from 'express-validator';
import * as jwt from 'jsonwebtoken';

import {User} from '../models/user';
import {BadRequestError} from '@ysaini_tickets/common';
import {validateRequest} from '@ysaini_tickets/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
      throw new BadRequestError('Email already in use.');
    } else {
      const user = User.build({email, password});

      await user.save();

      const token = jwt.sign(
        {id: user._id, email: user.email},
        process.env.JWT_KEY!
      );

      req.session = {jwt: token};
      return res.status(201).send(user);
    }
  }
);

export {router as signupRouter};
