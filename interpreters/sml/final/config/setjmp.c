#include <setjmp.h>
#include <stdlib.h>

int main()
{
  jmp_buf buf;
  int i;
  i = _setjmp(buf);
  if (i == 0) {
    _longjmp(buf, 12345);
  }
  exit (i != 12345);
}
