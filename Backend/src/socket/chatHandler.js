import Message from '../models/Message.js';

const chatHandler = (io, socket) => {
  // Join project room
  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Leave project room
  socket.on('leave_project', (projectId) => {
    socket.leave(projectId);
  });

  // Send message
  socket.on('send_message', async (data) => {
    const { projectId, senderId, content } = data;

    try {
      const message = await Message.create({
        project: projectId,
        sender: senderId,
        content,
      });

      const populatedMessage = await message.populate('sender', 'name email');

      io.to(projectId).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
};

export default chatHandler;
