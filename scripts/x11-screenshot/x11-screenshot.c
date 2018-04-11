#include <gdk/gdk.h>

int main (int argc, char *argv[])
{
  gdk_init(&argc, &argv);
  GdkWindow *root_win = gdk_get_default_root_window();
  gint width = gdk_window_get_width(root_win);
  gint height = gdk_window_get_height(root_win);

  GdkPixbuf *pb = gdk_pixbuf_get_from_window(root_win, 0, 0, width, height);
  gdk_pixbuf_save(pb, argv[1], "png", NULL, NULL);

  return 0;
}
