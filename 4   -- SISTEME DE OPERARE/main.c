#include "so_file_lib.h"

void print_usage() {
    printf("Usage:\r\n");
    printf("  open <filename> <mode>\n");
    printf("  close\n");
    printf("  read <size>\n");
    printf("  write <text>\n");
    printf("  seek <offset> <whence>\n");
}

int main() {
    SO_FILE* file = NULL;
    char command[256];

    while (1) {
        if (!fgets(command, sizeof(command), stdin)) {
            break;
        }

        char* token = strtok(command, " \n");
        if (!token) continue;

        if (strcmp(token, "open") == 0) {
            if (file) {
                printf("File already open. Close it first.\n");
                continue;
            }

            char* filename = strtok(NULL, " \n");
            char* mode = strtok(NULL, " \n");

            if (!filename || !mode) {
                print_usage();
                continue;
            }

            file = so_fopen(filename, mode);
            if (file) {
                printf("File opened successfully.\n");
            } else {
                printf("Failed to open file.\n");
            }
        } else if (strcmp(token, "close") == 0) {
            if (!file) {
                printf("No file is currently open.\n");
                continue;
            }

            if (so_fclose(file) == 0) {
                printf("File closed successfully.\n");
                file = NULL;
            } else {
                printf("Failed to close file.\n");
            }
        } else if (strcmp(token, "read") == 0) {
            if (!file) {
                printf("No file is currently open.\n");
                continue;
            }

            char* size_str = strtok(NULL, " \n");
            if (!size_str) {
                print_usage();
                continue;
            }

            size_t size = atoi(size_str);
            char* buffer = (char*)malloc(size + 1);
            if (!buffer) {
                printf("Memory allocation failed.\n");
                continue;
            }

            size_t read_count = so_fread(buffer, 1, size, file);
            buffer[read_count] = '\0';
            printf("Read: %s\n", buffer);
        } else if (strcmp(token, "write") == 0) {
            if (!file) {
                printf("No file is currently open.\n");
                continue;
            }

            char* text = strtok(NULL, "\n");
            if (!text) {
                print_usage();
                continue;
            }

            size_t written = so_fwrite(text, 1, strlen(text), file);
            if (written == strlen(text)) {
                printf("Write successful.\n");
            } else {
                printf("Write failed.\n");
            }
        } else if (strcmp(token, "seek") == 0) {
            if (!file) {
                printf("No file is currently open.\n");
                continue;
            }

            char* offset_str = strtok(NULL, " \n");
            char* whence_str = strtok(NULL, " \n");

            if (!offset_str || !whence_str) {
                print_usage();
                continue;
            }

            long offset = atol(offset_str);
            int whence = atoi(whence_str);

            if (so_fseek(file, offset, whence) == 0) {
                printf("Seek successful.\n");
            } else {
                printf("Seek failed.\n");
            }
        } else if (strcmp(token, "exit") == 0) {
            if (file) so_fclose(file);
            break;
        } else {
            print_usage();
        }
    }

    return 0;
}
