#include "so_file_lib.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#include <fcntl.h>
#endif

typedef struct
{
#ifdef _WIN32
  HANDLE file_handle;
#else
  int file_descriptor;
#endif
  long position; // Current position in the file
  char mode[4];  // Mode in which the file was opened
} SO_FILE;

SO_FILE *so_fopen(const char *pathname, const char *mode)
{
  SO_FILE *file = (SO_FILE *)malloc(sizeof(SO_FILE));
  if (!file)
    return NULL;

  strncpy(file->mode, mode, 3);
  file->mode[3] = '\0';

#ifdef _WIN32
  DWORD access = 0;
  DWORD creation = 0;

  if (strchr(mode, 'r'))
    access |= GENERIC_READ;
  if (strchr(mode, 'w'))
    access |= GENERIC_WRITE;
  if (strchr(mode, 'a'))
    access |= FILE_APPEND_DATA;

  if (strchr(mode, 'w'))
    creation = CREATE_ALWAYS;
  else if (strchr(mode, 'a'))
    creation = OPEN_ALWAYS;
  else
    creation = OPEN_EXISTING;

  file->file_handle = CreateFile(pathname, access, 0, NULL, creation, FILE_ATTRIBUTE_NORMAL, NULL);
  if (file->file_handle == INVALID_HANDLE_VALUE)
  {
    free(file);
    return NULL;
  }
#else
  int flags = 0;

  if (strchr(mode, 'r'))
    flags |= O_RDONLY;
  if (strchr(mode, 'w'))
    flags |= O_WRONLY | O_CREAT | O_TRUNC;
  if (strchr(mode, 'a'))
    flags |= O_WRONLY | O_CREAT | O_APPEND;

  file->file_descriptor = open(pathname, flags, 0644);
  if (file->file_descriptor < 0)
  {
    free(file);
    return NULL;
  }
#endif

  file->position = 0;
  return file;
}

int so_fclose(SO_FILE *stream)
{
  if (!stream)
    return -1;

#ifdef _WIN32
  if (CloseHandle(stream->file_handle) == 0)
    return -1;
#else
  if (close(stream->file_descriptor) < 0)
    return -1;
#endif

  free(stream);
  return 0;
}

size_t so_fread(void *ptr, size_t size, size_t count, SO_FILE *stream)
{
  if (!stream || !ptr)
    return -1;

  size_t total_bytes = size * count;
  size_t bytes_read = 0;

#ifdef _WIN32
  if (!ReadFile(stream->file_handle, ptr, total_bytes, &bytes_read, NULL))
    return -1;
#else
  bytes_read = read(stream->file_descriptor, ptr, total_bytes);
  if (bytes_read < 0)
    return -1;
#endif

  stream->position += bytes_read;
  return bytes_read / size;
}

size_t so_fwrite(const void *ptr, size_t size, size_t count, SO_FILE *stream)
{
  if (!stream || !ptr)
    return -1;

  size_t total_bytes = size * count;
  size_t bytes_written = 0;

#ifdef _WIN32
  if (!WriteFile(stream->file_handle, ptr, total_bytes, &bytes_written, NULL))
    return -1;
#else
  bytes_written = write(stream->file_descriptor, ptr, total_bytes);
  if (bytes_written < 0)
    return -1;
#endif

  stream->position += bytes_written;
  return bytes_written / size;
}

int so_fseek(SO_FILE *stream, long offset, int whence)
{
  if (!stream)
    return -1;

#ifdef _WIN32
  DWORD move_method;
  switch (whence)
  {
  case SEEK_SET:
    move_method = FILE_BEGIN;
    break;
  case SEEK_CUR:
    move_method = FILE_CURRENT;
    break;
  case SEEK_END:
    move_method = FILE_END;
    break;
  default:
    return -1;
  }

  DWORD new_position = SetFilePointer(stream->file_handle, offset, NULL, move_method);
  if (new_position == INVALID_SET_FILE_POINTER)
    return -1;

  stream->position = new_position;
#else
  off_t new_position = lseek(stream->file_descriptor, offset, whence);
  if (new_position == (off_t)-1)
    return -1;

  stream->position = new_position;
#endif

  return 0;
}

long so_ftell(SO_FILE *stream)
{
  if (!stream)
    return -1;

  return stream->position;
}

FD_TYPE so_get_fd(SO_FILE *stream)
{
  if (!stream)
    return -1;

#ifdef _WIN32
  return stream->file_handle;
#else
  return stream->file_descriptor;
#endif
}