// src/pages/NotificationPage.jsx
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import './NotificationPage.css';
import { useTranslation } from "react-i18next";

const BASE_URL = 'https://farm-project-bbzj.onrender.com';

const pickMessageByLang = (n, lang) => {
  if (lang?.startsWith('ar')) return n.messageAr || n.message || n.messageEn || '';
  return n.messageEn || n.message || n.messageAr || '';
};

function chipColor(kind, value) {
  const v = String(value || '').toLowerCase();
  if (kind === 'severity') {
    if (v === 'high') return '#ef4444';
    if (v === 'medium') return '#f59e0b';
    return '#10b981';
  }
  if (kind === 'stage') {
    if (v === 'expired') return '#ef4444';
    if (v === 'due_soon') return '#f59e0b';
    return '#6b7280';
  }
  return '#6b7280';
}

// -------- Component --------
export default function NotificationPage() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // ------ Local state for filters & paging ------
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [selected, setSelected] = useState({});

  const resetSelection = () => setSelected({});

  const params = useMemo(() => ({
    page,
    limit,
    type: filterType || undefined,
    stage: filterStage || undefined,
    severity: filterSeverity || undefined,
    unreadOnly: filterUnreadOnly || undefined,
    lang: i18n.language || 'en',
  }), [page, limit, filterType, filterStage, filterSeverity, filterUnreadOnly,  i18n.language]);

  // ------ Main fetch ------
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const lang = i18n.language || "en";
      await axiosInstance.get(`${BASE_URL}/api/notifications/check`, {
        params: { lang },
      });
      
      const res = await axiosInstance.get(`${BASE_URL}/api/notifications`, {
        params,
      });
      return res.data?.data || { notifications: [], pagination: null, unreadCount: 0 };
    },
    keepPreviousData: true,
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || t("load_error");
      toast.error(msg);
    },
  });

  const notifications = data?.notifications || [];
  const pagination = data?.pagination || { 
    currentPage: 1, 
    totalPages: 1, 
    hasNextPage: false, 
    hasPrevPage: false,
    total: 0
  };
  const unreadCount = data?.unreadCount ?? notifications.filter(n => !n.isRead).length;

  const activeNotifications = notifications.filter((n) => !n.isArchived);

  // ------ Selection helpers ------
  const allOnPageSelected = activeNotifications.length > 0
    && activeNotifications.every(n => selected[n._id]);

  const toggleSelectAllPage = () => {
    if (allOnPageSelected) {
      const copy = { ...selected };
      activeNotifications.forEach(n => { delete copy[n._id]; });
      setSelected(copy);
    } else {
      const copy = { ...selected };
      activeNotifications.forEach(n => { copy[n._id] = true; });
      setSelected(copy);
    }
  };

  const selectedIds = useMemo(() => Object.keys(selected).filter(id => selected[id]), [selected]);

  // ------ Mutations ------
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const lang = i18n.language || "en";
      return axiosInstance.patch(
        `${BASE_URL}/api/notifications/${id}/read`,
        {},
        { params: { lang }, validateStatus: s => s < 500 }
      );
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', params]);
      queryClient.setQueryData(['notifications', params], (old) => {
        if (!old) return old;
        const updated = (old.notifications || []).map(n => n._id === id ? { ...n, isRead: true } : n);
        return { ...old, notifications: updated, unreadCount: Math.max(0, (old.unreadCount ?? 0) - 1) };
      });
      return { prev };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', params], ctx.prev);
      toast.error(error?.response?.data?.message || error?.message || t("mark_error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t("mark_success"));
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const lang = i18n.language || "en";
      return axiosInstance.patch(
        `${BASE_URL}/api/notifications/read-all`,
        {},
        { params: { lang }, validateStatus: s => s < 500 }
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', params]);
      queryClient.setQueryData(['notifications', params], (old) => {
        if (!old) return old;
        const updated = (old.notifications || []).map(n => ({ ...n, isRead: true }));
        return { ...old, notifications: updated, unreadCount: 0 };
      });
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', params], ctx.prev);
      toast.error(error?.response?.data?.message || error?.message || t("mark_all_error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t("mark_all_success"));
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const lang = i18n.language || "en";
      const res = await axiosInstance.delete(
        `${BASE_URL}/api/notifications/${id}`,
        { params: { lang }, validateStatus: s => s < 500 }
      );
      if (res.status === 400) throw new Error(res.data?.message || t("delete_error"));
      return res.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const prev = queryClient.getQueryData(['notifications', params]);
      queryClient.setQueryData(['notifications', params], (old) => {
        if (!old) return old;
        const removed = (old.notifications || []).filter(n => n._id !== id);
        const wasUnread = (old.notifications || []).find(n => n._id === id && !n.isRead);
        return {
          ...old,
          notifications: removed,
          unreadCount: wasUnread ? Math.max(0, (old.unreadCount ?? 0) - 1) : old.unreadCount
        };
      });
      return { prev };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['notifications', params], ctx.prev);
      Swal.fire(t("error_title"), error?.message || t("delete_error"), 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      Swal.fire(t("deleted_title"), t("deleted_msg"), 'success');
    },
  });

  const bulkMarkRead = async () => {
    const ids = selectedIds.filter(id => {
      const n = activeNotifications.find(x => x._id === id);
      return n && !n.isRead;
    });
    if (ids.length === 0) return;
    
    await queryClient.cancelQueries({ queryKey: ['notifications'] });
    const prev = queryClient.getQueryData(['notifications', params]);
    queryClient.setQueryData(['notifications', params], (old) => {
      if (!old) return old;
      const updated = (old.notifications || []).map(n => ids.includes(n._id) ? { ...n, isRead: true } : n);
      const unreadDelta = (old.notifications || []).filter(n => ids.includes(n._id) && !n.isRead).length;
      return { ...old, notifications: updated, unreadCount: Math.max(0, (old.unreadCount ?? 0) - unreadDelta) };
    });
    
    try {
      await Promise.all(ids.map(id =>
        axiosInstance.patch(`${BASE_URL}/api/notifications/${id}/read`, {}, { params: { lang: i18n.language || 'en' } })
      ));
      toast.success(t("mark_success"));
      resetSelection();
    } catch (e) {
      queryClient.setQueryData(['notifications', params], prev);
      toast.error(e?.response?.data?.message || e?.message || t("mark_error"));
    } finally {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  };

  const bulkDelete = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    const confirm = await Swal.fire({
      title: t("confirm_title"),
      text: t("confirm_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("confirm_btn"),
      cancelButtonText: t("cancel_btn"),
    });
    if (!confirm.isConfirmed) return;

    await queryClient.cancelQueries({ queryKey: ['notifications'] });
    const prev = queryClient.getQueryData(['notifications', params]);
    queryClient.setQueryData(['notifications', params], (old) => {
      if (!old) return old;
      const removed = (old.notifications || []).filter(n => !ids.includes(n._id));
      const unreadRemoved = (old.notifications || []).filter(n => ids.includes(n._id) && !n.isRead).length;
      return { ...old, notifications: removed, unreadCount: Math.max(0, (old.unreadCount ?? 0) - unreadRemoved) };
    });

    try {
      await Promise.all(ids.map(id =>
        axiosInstance.delete(`${BASE_URL}/api/notifications/${id}`, { params: { lang: i18n.language || 'en' } })
      ));
      Swal.fire(t("deleted_title"), t("deleted_msg"), 'success');
      resetSelection();
    } catch (e) {
      queryClient.setQueryData(['notifications', params], prev);
      Swal.fire(t("error_title"), e?.response?.data?.message || e?.message || t("delete_error"), 'error');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  };

  // ------ Pagination Logic (مثل Animals) ------
  const renderModernPagination = () => {
    const total = pagination.totalPages || 1;
    const pageButtons = [];
    const maxButtons = 5;

    const addPage = (pageNum) => {
      pageButtons.push(
        <li
          key={pageNum}
          className={`page-item${pageNum === page ? " active" : ""}`}
        >
          <button 
            className="page-link" 
            onClick={() => { setPage(pageNum); resetSelection(); }}
            disabled={isFetching}
          >
            {pageNum}
          </button>
        </li>
      );
    };

    if (total <= maxButtons) {
      for (let i = 1; i <= total; i++) addPage(i);
    } else {
      addPage(1);
      if (page > 3) {
        pageButtons.push(
          <li key="start-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );
      }
      let start = Math.max(2, page - 1);
      let end = Math.min(total - 1, page + 1);
      if (page <= 3) end = 4;
      if (page >= total - 2) start = total - 3;
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < total) addPage(i);
      }
      if (page < total - 2) {
        pageButtons.push(
          <li key="end-ellipsis" className="pagination-ellipsis">
            ...
          </li>
        );
      }
      addPage(total);
    }

    return (
      <ul className="pagination">
        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => { setPage(page - 1); resetSelection(); }}
            disabled={page === 1 || isFetching}
          >
            &lt; {t("back")}
          </button>
        </li>
        {pageButtons}
        <li className={`page-item${page === total ? " disabled" : ""}`}>
          <button
            className="page-link pagination-arrow"
            onClick={() => { setPage(page + 1); resetSelection(); }}
            disabled={page === total || isFetching}
          >
            {t("Next")} &gt;
          </button>
        </li>
      </ul>
    );
  };

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

  // ------ Render ------
  if (isLoading) return <div className="loading">{t("loading")}</div>;
  if (isError) return <div className="error">{t("error_loading")}</div>;

  return (
    <div className={`notification-page container ${isRTL ? "rtl" : ""}`}>
      <nav>
        <header className="header">
          <div className="header-title">
            <h1><MdNotifications /> {t("notification_list")}</h1>
          </div>

          <div className="header-actions">
            {unreadCount > 0 && (
              <button
                className="btn btn-secondary"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isLoading || isFetching}
              >
                {t("mark_all_read")} ({unreadCount})
              </button>
            )}
          </div>
        </header>
      </nav>

      <main className="main-content">
        {/* Filters */}
        <section className="filters">
          

          <select
            className="select"
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); resetSelection(); }}
          >
            <option value="">{t("type_all")}</option>
            <option value="Treatment">{t("type_treatment")}</option>
            <option value="Vaccine">{t("type_vaccine")}</option>
            <option value="Weight">{t("type_weight")}</option>
          </select>

          <select
            className="select"
            value={filterSeverity}
            onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); resetSelection(); }}
          >
            <option value="">{t("severity_all")}</option>
            <option value="high">{t("severity_high")}</option>
            <option value="medium">{t("severity_medium")}</option>
            <option value="low">{t("severity_low")}</option>
          </select>

          <select
            className="select"
            value={filterStage}
            onChange={(e) => { setFilterStage(e.target.value); setPage(1); resetSelection(); }}
          >
            <option value="">{t("stage_all")}</option>
            <option value="expired">{t("stage_expired")}</option>
            <option value="due_soon">{t("stage_due_soon")}</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={(e) => { setFilterUnreadOnly(e.target.checked); setPage(1); resetSelection(); }}
            />
            {t("unread_only")}
          </label>
        </section>

        {/* Bulk bar */}
        <section className="bulk-bar">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={allOnPageSelected}
              onChange={toggleSelectAllPage}
              disabled={activeNotifications.length === 0}
            />
            {t("select_page")}
          </label>

          <button
            className="btn"
            style={{backgroundColor: "#e6f0ff",color: "#0f40e1", border: '#0f40e1 ', borderRadius: '5px'}}
            onClick={bulkMarkRead}
            disabled={selectedIds.length === 0}
            title={t("mark_selected")}
          >
            <FaCheck /> {t("mark_selected")}
          </button>

        </section>

        <div className="divider"></div>

        {/* List */}
        <ul className="notifications-list">
          {activeNotifications.length > 0 ? (
            activeNotifications.map((n) => {
              const msg = pickMessageByLang(n, i18n.language);
              const createdText = n.createdAt
                ? new Date(n.createdAt).toLocaleString(i18n.language, {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                : '';
              const dueText = n.dueDate
                ? new Date(n.dueDate).toLocaleDateString(i18n.language, {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })
                : null;

              return (
                <li key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={!!selected[n._id]}
                      onChange={(e) => setSelected(s => ({ ...s, [n._id]: e.target.checked }))}
                    />
                  </div>

                  <div className="notification-content">
                    <p className="notification-message">{msg}</p>

                    <div className="badges">
                      <span className="chip-type chip" >
                        {n.type}
                      </span>
                      <span className="chip-severity chip" >
                        {n.severity}
                      </span>
                      <span className="chip-stage chip" >
                        {n.stage}
                      </span>
                      {dueText && (
                        <span className="chip-dueText chip" title="Due date">
                          🗓 {dueText}
                        </span>
                      )}
                      {Array.isArray(n.relatedNotifications) && n.relatedNotifications.length > 0 && (
                        <span className="chip-length chip" title={t("related_tooltip")}>
                          🔗 {n.relatedNotifications.length}
                        </span>
                      )}
                    </div>

                    <p className="notification-time">{createdText}</p>
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
              );
            })
          ) : (
            <div className="empty-state">
              <p>{t("no_notifications")}</p>
            </div>
          )}
        </ul>

        {/* Pagination - Updated to match Animals style */}
        <div className="pagination-container">
          {renderModernPagination()}
        </div>
      </main>
    </div>
  );
}