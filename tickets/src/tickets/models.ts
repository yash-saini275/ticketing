import * as mongoose from 'mongoose';
import {Document, Model, Schema} from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketDto {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketDto): TicketDoc;
}

const ticketSchema = new Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketDto) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket, TicketDto, TicketDoc};
