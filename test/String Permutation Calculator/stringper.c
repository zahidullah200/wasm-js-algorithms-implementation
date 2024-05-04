// stringper.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

void permute(char *str, int l, int r, char ***result, int *result_index) {
    if (l == r) {
        strcpy((*result)[(*result_index)++], str);
    } else {
        for (int i = l; i <= r; i++) {
            char temp = str[l];
            str[l] = str[i];
            str[i] = temp;

            permute(str, l + 1, r, result, result_index);

            temp = str[l];
            str[l] = str[i];
            str[i] = temp;
        }
    }
}

char** generatePermutations(char* str) {
    int n = strlen(str);
    int fact = 1;
    for (int i = 1; i <= n; i++)
        fact *= i;

    char** result = (char**)malloc(fact * sizeof(char*));
    for (int i = 0; i < fact; i++) {
        result[i] = (char*)malloc((n + 1) * sizeof(char));
        result[i][n] = '\0';
    }

    int result_index = 0;
    permute(str, 0, n - 1, &result, &result_index);

    return result;
}

EMSCRIPTEN_KEEPALIVE
char** calculatePermutations(char* str) {
    return generatePermutations(str);
}

int main() {
    char input[] = "abcd";
    char** permutations = calculatePermutations(input);
    for (int i = 0; i < 24; i++) {
        printf("%s\n", permutations[i]);
    }
    return 0;
}
