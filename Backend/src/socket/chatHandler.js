import Message from "../models/Message.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { createNotification } from "../controllers/notificationController.js";

const chatHandler = (io, socket) => {
  // Join project room
  socket.on("join_project", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Leave project room
  socket.on("leave_project", (projectId) => {
    socket.leave(projectId);
  });

  // Send message
  socket.on("send_message", async (data) => {
    const { projectId, senderId, content } = data;
    const isGeneral = projectId === "general";

    try {
      const message = await Message.create({
        project: isGeneral ? undefined : projectId,
        isGeneral,
        sender: senderId,
        content,
      });

      const populatedMessage = await message.populate(
        "sender",
        "name email role",
      );

      io.to(projectId).emit("receive_message", populatedMessage);

      // Create notifications for others
      if (!isGeneral) {
        const project = await Project.findById(projectId);
        if (project) {
          const recipients = [project.client, ...project.employees].filter(
            (id) => id && id.toString() !== senderId.toString(),
          );

          for (const recipientId of recipients) {
            const notification = await createNotification(
              recipientId,
              `New message in ${project.name}: ${content.substring(0, 50)}...`,
              "info",
              "/chat",
            );

            if (notification) {
              io.emit("notification", notification);
            }
          }
        }
      } else {
        // General chat - notify all admins/employees except sender
        const team = await User.find({ role: { $in: ["admin", "employee"] } });
        for (const member of team) {
          if (member._id.toString() !== senderId.toString()) {
            const notification = await createNotification(
              member._id,
              `General message from ${populatedMessage.sender.name}: ${content.substring(0, 50)}...`,
              "info",
              "/chat",
            );
            if (notification) {
              io.emit("notification", notification);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};

export default chatHandler;
