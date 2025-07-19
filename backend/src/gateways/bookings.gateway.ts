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

  @SubscribeMessage('join-driver-room')
  handleJoinDriverRoom(
    @MessageBody() data: { driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`driver-${data.driverId}`);
    console.log(`Driver ${data.driverId} joined room`);
  }

  @SubscribeMessage('join-admin-room')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    client.join('admin');
    console.log('Admin joined room');
  }

  // Emit new booking to all drivers
  emitNewBooking(booking: any) {
    this.server.emit('new-booking', booking);
  }

  // Emit booking status update
  emitBookingStatusUpdate(booking: any) {
    this.server.emit('booking-status-update', booking);
    
    // Also emit to specific driver if assigned
    if (booking.driverId) {
      this.server.to(`driver-${booking.driverId}`).emit('driver-booking-update', booking);
    }
  }

  // Emit driver status update
  emitDriverStatusUpdate(driverId: string, status: string) {
    this.server.to('admin').emit('driver-status-update', { driverId, status });
  }
} 