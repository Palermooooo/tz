#include <iostream>
#include<string>
#include<algorithm>
using namespace std;

int main()
{
    int kol = 0;
    string s;
    getline(cin,s);
    for (int i = 0; i < s.size(); i++)
    {
    if (s[i] == '0' || s[i] == '6' || s[i] == '9') kol++;
    if (s[i] == '8') kol+=2;    
    }
    cout<<kol;
}