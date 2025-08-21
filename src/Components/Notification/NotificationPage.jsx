import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaCheck, FaArchive } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import './NotificationPage.css';

const BASE_URL = 'https://farm-project-bbzj.onrender.com';

function NotificationPage() {
  const queryClient = useQueryClient();

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    return token
      ? { 
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : {};
  };

  // Fetch notifications
  const { data: notifications = [], isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/notifications`, {
          headers: getHeaders()
        });
        return response.data.data.notifications;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to load notifications');
      }
    },
    onError: (error) => toast.error(error.message)
  });

  // Mark as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (id) => {
      try {
        await axios.patch(
          `${BASE_URL}/api/notifications/${id}/read`, 
          {}, 
          { 
            headers: getHeaders(),
            validateStatus: (status) => status < 500
          }
        );
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to mark as read');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      toast.success('Notification marked as read');
    },
    onError: (error) => toast.error(error.message)
  });

  // Mark all as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      try {
        await axios.patch(
          `${BASE_URL}/api/notifications/read-all`, 
          {}, 
          { 
            headers: getHeaders(),
            validateStatus: (status) => status < 500
          }
        );
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to mark all as read');
      }
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => toast.error(error.message)
  });

//   const { mutate: archiveNotification } = useMutation({
//     mutationFn: async (id) => {
//       try {
//         const response = await axios.patch(
//           `${BASE_URL}/api/notifications/${id}/read`,
//           {}, 
//           { 
//             headers: getHeaders(),
//             validateStatus: (status) => status < 500
//           }
//         );
        
//         if (response.status === 400) {
//           throw new Error(response.data?.message || 'Cannot archive this notification');
//         }
        
//         return response.data;
//       } catch (error) {
//         throw new Error(error.response?.data?.message || error.message || 'Failed to archive notification');
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['notifications']);
//       Swal.fire('Archived!', 'Your notification has been archived.', 'success');
//     },
//     onError: (error) => {
//       Swal.fire('Error!', error.message, 'error');
//     }
//   });

//   const handleArchive = (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You want to archive this notification?",
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, archive it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         archiveNotification(id);
//       }
//     });
//   };

  // Delete notification with SweetAlert confirmation
  
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/notifications/${id}`,
          { 
            headers: getHeaders(),
            validateStatus: (status) => status < 500
          }
        );
        
        if (response.status === 400) {
          throw new Error(response.data?.message || 'Cannot delete this notification');
        }
        
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete notification');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      Swal.fire('Deleted!', 'Your notification has been deleted.', 'success');
    },
    onError: (error) => {
      Swal.fire('Error!', error.message, 'error');
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNotification(id);
      }
    });
  };

  if (isLoading) return <div className="loading">Loading notifications...</div>;
  if (isError) return <div className="error">An error occurred while loading notifications.</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const archivedCount = notifications.filter(n => n.isArchived).length;
  const activeNotifications = notifications.filter(n => !n.isArchived);

  return (
    <div className="notification-page container">
        <nav>
            <header className="header">
          <div className="header-title">
            <h1><MdNotifications /> List Notification</h1>
          </div>
         
        </header>
        </nav>
      <main className="main-content">
        
         {unreadCount > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </button>
          )}
        <div className="notification-stats">
          <h3>({activeNotifications.length}) Notification{activeNotifications.length !== 1 ? 's' : ''}</h3>
           
          <div className="notification-tabs mt-4">
            <div className="tab active">
              All ({unreadCount} unread)
            </div>
            
          </div>
        </div>

        <div className="divider"></div>

        <ul className="notifications-list">
          {activeNotifications.length > 0 ? (
            activeNotifications.map(n => (
              <li
                key={n._id}
                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
              >
                <div className="notification-checkbox">
                  <input 
                    type="checkbox" 
                    checked={n.isRead}
                    onChange={() => markAsRead(n._id)}
                  />
                </div>
                <div className="notification-content">
                  <p className="notification-message">{n.message}</p>
                  <p className="notification-time">
                    {new Date(n.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="notification-actions">
                    <FaCheck 
                        className="icon-action mark-read"
                        title="Mark as Read"
                        style={{ color: n.isRead ? 'green' : 'gray' }}
                        onClick={() => markAsRead(n._id)}
                    />
                  <RiDeleteBin6Line 
                    className="icon-action delete"
                    title="Delete"
                    style={{ color: 'red' }}
                    onClick={() => handleDelete(n._id)}
                  />
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              <p>No notifications available.</p>
            </div>
          )}
        </ul>
      </main>
    </div>
  );
}

export default NotificationPage;