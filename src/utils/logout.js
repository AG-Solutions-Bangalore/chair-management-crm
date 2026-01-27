import Cookies from "js-cookie";

export const appLogout = () => {
  const cookiesToRemove = [
    "token",
    "id",
    "name",
    "username",
    "chapter_id",
    "viewer_chapter_ids",
    "user_type_id",
    "token-expire-time",
    "ver_con",
    "email",
    "currentYear",
    "favorite_chapters",
    "recent_chapters",
  ];

  cookiesToRemove.forEach((cookie) => Cookies.remove(cookie));

  localStorage.clear();
};
