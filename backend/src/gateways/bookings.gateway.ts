import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
})
export class BookingsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-notary-room')
  handleJoinNotaryRoom(
    @MessageBody() data: { notaryId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`notary-${data.notaryId}`);
    console.log(`Notary ${data.notaryId} joined room`);
  }

  @SubscribeMessage('join-admin-room')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    client.join('admin');
    console.log('Admin joined room');
  }

  // Emit new booking to all notaries
  emitNewBooking(booking: any) {
    this.server.emit('new-booking', booking);
  }

  // Emit booking status update
  emitBookingStatusUpdate(booking: any) {
    this.server.emit('booking-status-update', booking);
    
    // Also emit to specific notary if assigned
    if (booking.driverId) {
      this.server.to(`notary-${booking.driverId}`).emit('notary-booking-update', booking);
    }
  }

  // Emit notary status update
  emitNotaryStatusUpdate(notaryId: string, status: string) {
    this.server.to('admin').emit('notary-status-update', { notaryId, status });
  }
} 