// src/pages/NotificationPage.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import './NotificationPage.css';
import { useTranslation } from "react-i18next";

const BASE_URL = 'https://farm-project-bbzj.onrender.com';

function NotificationPage() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    return token
      ? {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {};
  };

  // ===== Unified fetch: run /check first, then fetch the list =====
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notifications', i18n.language],
    queryFn: async () => {
      const lang = i18n.language || "en";
      // 1) trigger check (creates/updates notifications server-side)
      await axios.get(`${BASE_URL}/api/notifications/check`, {
        headers: getHeaders(),
        params: { lang },
      });
      // 2) fetch final list
      const res = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: getHeaders(),
        params: { lang },
      });
      return res.data?.data?.notifications || [];
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || t("load_error");
      toast.error(msg);
    },
    // refetch on language change handled by queryKey
  });

  // ===== Mutations with optimistic updates =====

  // Mark as read (single)
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const lang = i18n.language || "en";
      return axios.patch(
        `${BASE_URL}/api/notifications/${id}/read`,
        {},
        { headers: getHeaders(), params: { lang }, validateStatus: s => s < 500 }
      );
    },
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', i18n.language]);
      queryClient.setQueryData(['notifications', i18n.language], (old = []) =>
        old.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      return { prev };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', i18n.language], ctx.prev);
      toast.error(error?.response?.data?.message || error?.message || t("mark_error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t("mark_success"));
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const lang = i18n.language || "en";
      return axios.patch(
        `${BASE_URL}/api/notifications/read-all`,
        {},
        { headers: getHeaders(), params: { lang }, validateStatus: s => s < 500 }
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', i18n.language]);
      queryClient.setQueryData(['notifications', i18n.language], (old = []) =>
        old.map(n => ({ ...n, isRead: true }))
      );
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', i18n.language], ctx.prev);
      toast.error(error?.response?.data?.message || error?.message || t("mark_all_error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t("mark_all_success"));
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const lang = i18n.language || "en";
      const res = await axios.delete(
        `${BASE_URL}/api/notifications/${id}`,
        { headers: getHeaders(), params: { lang }, validateStatus: s => s < 500 }
      );
      if (res.status === 400) {
        throw new Error(res.data?.message || t("delete_error"));
      }
      return res.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', i18n.language]);
      queryClient.setQueryData(['notifications', i18n.language], (old = []) =>
        old.filter(n => n._id !== id)
      );
      return { prev };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', i18n.language], ctx.prev);
      Swal.fire(t("error_title"), error?.message || t("delete_error"), 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      Swal.fire(t("deleted_title"), t("deleted_msg"), 'success');
    },
  });

  // UI handlers
  const handleDelete = (id) => {
    Swal.fire({
      title: t("confirm_title"),
      text: t("confirm_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("confirm_btn"),
      cancelButtonText: t("cancel_btn"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNotificationMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div className="loading">{t("loading")}</div>;
  if (isError) return <div className="error">{t("error_loading")}</div>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const activeNotifications = notifications.filter((n) => !n.isArchived);

  return (
    <div className="notification-page container">
      <nav>
        <header className="header">
          <div className="header-title">
            <h1>
              <MdNotifications /> {t("notification_list")}
            </h1>
          </div>
        </header>
      </nav>

      <main className="main-content">
        {unreadCount > 0 && (
          <button
            className="mark-all-read-btn"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isLoading}
          >
            {t("mark_all_read")}
          </button>
        )}

        <div className="notification-stats">
          <h3>
            ({activeNotifications.length}) {t("notifications")} - {unreadCount} {t("unread")}
          </h3>

          <div className="notification-tabs mt-4">
            <div className="tab active">
              {t("all_tab")} ({unreadCount} {t("unread")})
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <ul className="notifications-list">
          {activeNotifications.length > 0 ? (
            activeNotifications.map((n) => (
              <li key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                <div className="notification-checkbox">
                  <input
                    type="checkbox"
                    checked={!!n.isRead}
                    onChange={() => !n.isRead && markAsReadMutation.mutate(n._id)}
                  />
                </div>

                <div className="notification-content">
                  <p className="notification-message">{n.message}</p>
                  <p className="notification-time">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString(i18n.language, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>

                <div className="notification-actions">
                  <FaCheck
                    className="icon-action mark-read"
                    title={t("mark_read")}
                    style={{ color: n.isRead ? 'green' : 'gray' }}
                    onClick={() => !n.isRead && markAsReadMutation.mutate(n._id)}
                  />
                  <RiDeleteBin6Line
                    className="icon-action delete"
                    title={t("delete")}
                    style={{ color: 'red' }}
                    onClick={() => handleDelete(n._id)}
                  />
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              <p>{t("no_notifications")}</p>
            </div>
          )}
        </ul>
      </main>
    </div>
  );
}

export default NotificationPage;