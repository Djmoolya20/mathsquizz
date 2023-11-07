

#include <stdio.h>

#include <stdlib.h>

#include <time.h>

 

// Function to allow the player to choose the operator

int operator_selection() {

    int newOperator;

    printf("Operator Selection:\n");

    printf("1. Addition (+)\n");

    printf("2. Subtraction (-)\n");

    printf("3. Multiplication (*)\n");

    printf("Enter the number for your desired operator: ");

    scanf("%d", &newOperator);

    return newOperator;

}

 

int main() {

    int num1, num2, playerAnswer, correctAnswer;

    int limit, numQuestions, operatorChoice;

    int correct = 0, questionsAttempted = 0;

    float c, q;

    srand(time(NULL)); // Seed the random number generator with the current time

 

    printf("Welcome to the Math Game!\n");

    printf("Gamer, let's start\n");

 

    printf("Difficulty Levels:\n");

    printf("1. Easy (Numbers between 0-30)\n");

    printf("2. Normal (Numbers between 30-100)\n");

    printf("3. Hard (Numbers 100 and above)\n");

    printf("Enter the number for your desired difficulty level: ");

    int difficultyChoice;

    scanf("%d", &difficultyChoice);

 

    // Set the difficulty level based on user choice

    switch (difficultyChoice) {

        case 1:

            limit = 30;

            break;

        case 2:

            limit = 100;

            break;

        case 3:

            limit = 1000; // You can adjust the upper limit for the "Hard" level

            break;

        default:

            printf("Invalid choice. Defaulting to Normal.\n");

            limit = 100;

            break;

    }

 

    printf("You've chosen the ");

    if (limit <= 30) {

        printf("Easy");

    } else if (limit <= 100) {

        printf("Normal");

    } else {

        printf("Hard");

    }

    printf(" difficulty level.\n");

 

    while (1) {

        // Allow the player to select the operator and validate the choice

        printf("Operator Selection:\n");

        printf("1. Addition (+)\n");

        printf("2. Subtraction (-)\n");

        printf("3. Multiplication (*)\n");

        printf("Enter the number for your desired operator: ");

        scanf("%d", &operatorChoice);

 

        if (operatorChoice >= 1 && operatorChoice <= 4) {

            break;

        } else {

            printf("Invalid operator choice. Please choose 1, 2, 3, or 4.\n");

        }

    }

 

    printf("Enter the number of questions you want to attempt: ");

    scanf("%d", &numQuestions);

 

    while (questionsAttempted < numQuestions) {

        if (operatorChoice == 4) {

            operatorChoice = operator_selection();

        }

 

        num1 = rand() % (limit + 1);

        num2 = rand() % (limit + 1);

 

        // Determine the operator and present the corresponding question

        switch (operatorChoice) {

            case 1:

                correctAnswer = num1 + num2;

                printf("Question %d: What is %d + %d?\n", questionsAttempted + 1, num1, num2);

                break;

            case 2:

                correctAnswer = num1 - num2;

                printf("Question %d: What is %d - %d?\n", questionsAttempted + 1, num1, num2);

                break;

            case 3:

                correctAnswer = num1 * num2;

                printf("Question %d: What is %d * %d?\n", questionsAttempted + 1, num1, num2);

                break;

       

                   

            default:

                printf("Invalid operator choice. Defaulting to addition (+).\n");

                correctAnswer = num1 + num2;

                printf("Question %d: What is %d + %d?\n", questionsAttempted + 1, num1, num2);

                break;

        }

 

        scanf("%d", &playerAnswer);

       

        if (playerAnswer == correctAnswer) {

            printf("Correct! %d is indeed %d.\n", correctAnswer, playerAnswer);

            correct++;

        } else {

            printf("Oops, that's not correct. The correct answer is %d.\n", correctAnswer);

        }

 

        // Visual separator for better readability

        printf("________________\n");

 

        questionsAttempted++;

        

        if (questionsAttempted == numQuestions) {

            break;

        }

       

        printf("Enter 'c' to change the operator, 'q' to quit, or any other key to continue: ");

        char choice;

        scanf(" %c", &choice);

 

        if (choice == 'q') {

            break;

        } else if (choice == 'c') {

            operatorChoice = operator_selection();

        }

    }

 

    c = correct;

    q = questionsAttempted;

 

    printf("Game over.\n You attempted %d questions.\n", questionsAttempted);

    printf("Your score is %d/%d\n", correct, questionsAttempted);

 

    // Provide feedback based on the player's performance

    if (c / q == 1) {

        printf("PERFECT");

    } else if (c / q >= 0.6) {

        printf("AMAZING !!!");

    } else if (0.3 <= c / q && c / q < 0.6) {

        printf("GOOD");

    } else {

        printf("Don't Give Up! Try Again");

    }

 

    return 0;

}
