#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <emscripten.h>

// Define a struct to represent key-value pairs
typedef struct
{
    char key[20];
    int value;
} KeyValuePair;

// Function to populate the hash table and perform the lookup
EMSCRIPTEN_KEEPALIVE
int testHashLookup()
{
    // Create a hash table with 1000 key-value pairs
    const long int size = 1000;
    KeyValuePair hashTable[size];

    // Populate the hash table
    for (int i = 0; i < size; i++)
    {
        sprintf(hashTable[i].key, "key_%d", i);
        hashTable[i].value = i;
    }

    // Perform the lookup and calculate sum
    long long int sum = 0;
    for (int i = 0; i < size; i++)
    {
        sum += hashTable[i].value;
    }

    return sum;
}

// Main function
int main()
{
    return 0;
}
