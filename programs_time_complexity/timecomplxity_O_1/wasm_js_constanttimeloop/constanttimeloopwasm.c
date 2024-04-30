#include <emscripten.h>

// Function to generate and return an array of 10 numbers
EMSCRIPTEN_KEEPALIVE
int *generateNumbers()
{
    static int numbers[10000];
    for (int i = 0; i < 10000; i++)
    {
        numbers[i] = i + 1;
    }
    return numbers;
}
