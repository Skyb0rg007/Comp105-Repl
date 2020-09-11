#include <stdlib.h>
signed char foo[]="\377";
int main()
{
  int i;
  i = foo[0];
  exit(i != -1);
}
