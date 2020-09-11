#include <stdio.h>
int main(argc, argv)
     int argc;
     char ** argv;
{
  printf("%zu %zu %zu\n", sizeof(int), sizeof(long), sizeof(long *));
  return 0;
}
