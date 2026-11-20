---
layout:     post
title:      "算法分析（基础篇）"
intro:      ""
date:       2020-2-17 16:13:00
author:     "Makinohara"
catalog: true
tags:
    - 计算机基础

---



## 枚举

枚举可以说是算法中最最最最弱智的一种算法了,其基本原理就是根据题目意思将所有可能的情况都试一遍,如果达到题目要求就记录下来或者输出.没有达到题目要求就跳过.但是,枚举也是需要一些技巧的,否则你要把所有的情况都真的试一下后,会遭遇可怜的TLE.

首先,如果遇到非正即反的枚举情况(即情况可以用0或1表示),可以尝试使用[bitset](#bitset)进行救命,因为bitset占用空间少,且只模拟0和1两种情况.

对于某些特殊情况的枚举,可以考虑用前一层枚举的情况直接通过计算得出后面的枚举结果,比如说熄灯问题(这是一个我看过的MOOC的问题,现在不太好解释),这样可以大大减少枚举的时间复杂度.

枚举的实现一般是通过循环实现的.至于怎么循环,怎么嵌套,我想我不必再过多解释**.但值得注意的是,循环变量一定要设置好!!!(尽量自己写循环结构,用vscode自动生成的可能会搞错)且一定要在此时记录循环变量的含义(最好注释下来).这样真的很有利于后面的判断和调试!**

称硬币问题的枚举:(POJ1013)

```c++
#include <iostream>
#include <stdio.h>
#include <string.h>

using namespace std;

char eleft[3][7];   //the coin status of eleft
char eright[3][7];  //the coin status of eright
char eresult[3][7]; //the eresult of each try

bool get_result(char coin, bool isLight)
{
    if (isLight)
    {
        for (int k = 0; k < 3; k++) //Judge 3 cases
        {
            if (eresult[k][0] == 'e') //this case is even
            {
                if (strchr(eleft[k], coin) != NULL || strchr(eright[k], coin) != NULL)
                {
                    return false;
                }
            }
            if (eresult[k][0] == 'u') //this case is up
            {
                if (strchr(eright[k], coin) == NULL)
                {
                    return false;
                }
            }
            if (eresult[k][0] == 'd') //this case is down
            {
                if (strchr(eleft[k], coin) == NULL)
                {
                    return false;
                }
            }
        }
    }
    else
    {
        for (int k = 0; k < 3; k++) //Judge 3 cases
        {
            if (eresult[k][0] == 'e') //this case is even
            {
                if (strchr(eleft[k], coin) != NULL || strchr(eright[k], coin) != NULL)
                {
                    return false;
                }
            }
            if (eresult[k][0] == 'u') //this case is up
            {
                if (strchr(eleft[k], coin) == NULL)
                {
                    return false;
                }
            }
            if (eresult[k][0] == 'd') //this case is down
            {
                if (strchr(eright[k], coin) == NULL)
                {
                    return false;
                }
            }
        }
    }

    return true;
};

int main()
{
    int case_number = 0;
    cin >> case_number;                   //Get case number
    for (int i = 0; i < case_number; i++) //Output the eresult of each case
    {
        for (int j = 0; j < 3; j++)
        {
            cin >> eleft[j] >> eright[j] >> eresult[j];
        }

        for (char j = 'A'; j <= 'L'; j++)
        {
            bool isLight = true; //The fake coin is light
            if (get_result(j, isLight))
                cout << j << " is the counterfeit coin and it is light." << endl;
            isLight = false;
            if (get_result(j, isLight))
                cout << j << " is the counterfeit coin and it is heavy." << endl;
        }
    }

    return 0;
}
```

关于枚举,先写到这吧,后面如果遇到一些古怪的枚举方式,再补.

## 模拟

模拟,顾名思义,就是根据题目所给的实现方式和思想写代码,这种题目一般来说都伴随着大量的判断和循环,且隐含着一些算法思想.若是单纯的硬模拟可能会导致TLE.

模拟题的数据一般而言会实现地十分古怪,所以你必须考虑一些特殊情况.所以写模拟题最烦人地地方就在于DEBUG!你怎么知道你是不是漏了情况!

模拟题的写法比较灵活多样,并且需要很强的文字阅读能力来理解题意.而且模拟题容易转变为其他类型的算法题,所以也不好直接讨论.

//举例几道题,凑合得了,模拟的笔记我没法写...

## 贪心

贪心算法就是在进行每一步操作时尽可能寻找最优解,此种算法可能需要依托一些数据结构(队列;优先队列<堆>)来实现.

接下来看一道使用贪心算法的题目:

此题使用了优先队列的思想.优先队列其实就是一种贪心,即:先取出优先级最大的元素.而贪心算法的原理就是先执行最优步骤,等到最优步骤执行完后再执行次优步骤.

上代码:

```c++
#include <bits/stdc++.h>

using namespace std;

int main()
{
    int qty_apple;
    cin>>qty_apple;
    priority_queue<int, vector<int>, greater<int>> apples;
    for (int i = 0; i < qty_apple; i++)
    {
        int temp_in;
        cin >> temp_in;
        apples.push(temp_in);
    }
    int sum = 0;
    while (true)
    {
        int t_effort = 0;
        t_effort += apples.top();
        apples.pop();
        t_effort += apples.top();
        apples.pop();
        sum += t_effort;
        if (apples.empty())
            break;
        apples.push(t_effort);
    }
    cout << sum << endl;
    return 0;
}
```



## 递归

递归就是函数自己调用自己.这样就能实现一些较为复杂且很难单纯用循环写出来的算法.

递归的一个典型例子就是***汉诺塔问题***,这个问题不仅是一个对递归思想的很好解释,同时也有利于深刻了解递归的原理.

接下来看汉诺塔问题

汉诺塔 （ 又称河内塔 ） 问题是源于印度一个古老传说的益智玩具 。 古代有一个梵塔 ， 塔内有座 A 、 B 、 C ， A 座上有 64 个盘子 ， 盘子大小不等 ， 大的在下 ， 小的在上 。 有一个和尚想把盘子从 A 座移到 B 座 ， 但每次只能允许移动一个盘子 ， 并且在移动过程中 ， 3 个座上的盘始终保持大盘在下，小盘在上。在移动过程中可以利用 B 座.

```c++
#include <iostream>
using namespace std;
void move(int n, char A, char B,char C);//声明函数(递归的调用)
int main()
{ 
	int discCount;
    cin>>discCount;
    move(discCount,'A','B','C');
	return 0;
}
void move(int n, char A, char B,char C)//自定义函数
{
	if(n==0)//盘子为0的时候返回
	{
		return;
	}
	else
	{
		//算法分析:要使得最底下最大的盘子能移到C,必须先把n-1个盘子移到B,于是有:
        //我们不需要管下一个递归是怎么解决n-1个盘子移动问题的,我们只负责命令它执行:
        move(n-1,A,C,B);//先把n-1个盘子从A移动到B,借助C
        //(此时在递归程序里的调用依然是A移动到C,但盘子的序号变了)
        //当作完成了n-1个盘子的移动,最后有:
		cout<<A<<"-->"<<C<<endl;//把最后一个盘子(相对最大的)从A移动到C
		move(n-1,B,A,C);//最后把n-1个盘子从B移动到C,使用A作为中转.
        //因为此时A上面已经没有比相对最大的盘子大的了
		return;//移动完成,程序结束
	}
}

```



## 深度优先搜索(DFS)

深度优先搜索,即先想某一纵深进行搜索,由于主要是写给自己看的,所以就从简了,简而言之,其是隐式地运用了栈的思想实现的.

先看一个八皇后的问题(洛谷P1219)

------

题目描述

检查一个如下的6 x 6的跳棋棋盘，有六个棋子被放置在棋盘上，使得每行、每列有且只有一个，每条对角线(包括两条主对角线的所有平行线)上至多有一个棋子。

![img](/img/60.png)

上面的布局可以用序列2 4 6 1 3 5来描述，第i个数字表示在第i行的相应位置有一个棋子，如下：

行号 1 2 3 4 5 6

列号 2 4 6 1 3 5

这只是跳棋放置的一个解。请编一个程序找出所有跳棋放置的解。并把它们以上面的序列方法输出。解按字典顺序排列。请输出前3个解。最后一行是解的总个数。

输入格式

一个数字N (6 <= N <= 13) 表示棋盘是N x N大小的。

输出格式

前三行为前三个解，每个解的两个数字之间用一个空格隔开。第四行只有一个数字，表示解的总数。

------

接下来请看代码

```c++
#include <bits/stdc++.h>

using namespace std;

int ans[14] = {0};
int vline[14] = {0};
int lcross[14] = {0};
int rcross[114] = {0}; //分别对应列 左 右 对角线(对角线请注意加一个n，n=100)
int sum = 0;
void dfs(int width, int line)
{
    if (line > width) //达到结果就输出(深搜结束标识)
    {
        sum++;
        if (sum <= 3)
        {
            for (int j = 1; j <= width; j++) //这里的i代表行号
            {
                cout << ans[j] << " ";
            }
            cout << endl;
        }
        
        return;
    }
    //正式算法
    //占位
    for (int i = 1; i <= width; i++) //排查未用然后使用
    {
        if (vline[i] != 1 && lcross[i + line] != 1 && rcross[i - line + 100] != 1)
        {
            //占用
            ans[line] = i;
            vline[i] = 1;
            lcross[i + line] = 1;
            rcross[i - line + 100] = 1;
            dfs(width, line + 1);
            //你应当特别注意这一步!这里是深搜向下扩展的重要步骤!!!
            //回溯(在上面的程序结束后,意味着深搜已经完成并return,
            //那么在return下面必须将程序的状态恢复到扩展下一层前的状态!!!
            //注意这很重要,并且可能需要考虑如何做这样一件事)
            vline[i] = 0;
            lcross[i + line] = 0;
            rcross[i - line + 100] = 0;
        }
    }
};

int main()
{
    int width = 0;
    cin >> width;  //获取棋盘的宽度
    dfs(width, 1); //从第1行开始
    cout<<sum;

    return 0;
}
```

这只是一个深搜的例子,后面我会继续扩充一些其他的例子以及用法!

## 广度优先搜索

广度优先搜索使用了队列的思想.广度优先搜索总是先搜索步长最近的搜索结果,这样就可以求解一些类似于最短路径之类的问题.

广度优先搜索的结果可以搜索到的结果保证步长最短.

## 动态规划

动态规划就是使用历史数据来避免重复计算,从而拆分求解一些复杂的问题.

### 一维动态规划

1.建立动态规划数组dp[]

2.确定dp[i]的含义

3.确定递推表达式

4.找出初始值用于递推

5.由是,可以求出dp[i]的值

接下来看一道简单的动态规划题目:

青蛙跳台阶问题:

> 问题描述：一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法。 

1.建立dp[]

2.确定dp[i] 的含义,这里的dp[i]的含义是第i个台阶青蛙要跳的步数.

3.**找出关系式**:dp[i]=dp[i-2]+dp[i-1],由于青蛙可以从i-2级或i-1级跳上来,所以第i层的情况数就是i-2层的情况和i-1层相加.

4.初始值:dp[0]=0,dp[1]=1,dp[2]=2,OK!

5.编写程序运行:

```c++
#include <bits/stdc++.h>
int main()
{
    int n;//the floor 
    std::cin >> n;
    int dp[100] = {0};
    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= 100; i++)
    {
        dp[i] = dp[i - 2] + dp[i - 1];
    }
    std::cout << dp[n] << std::endl;
    return 0;
}
```

### 动态规划的背包问题

**0-1背包问题的递推关系**

f[j]=max(f[j],f[j-price[i]]+value[i])(考虑第i个产品的购买问题)

​                ↑不改变背包       ↑改变背包,价值为钱减少后的背包里的价值(当作已算出)加上现有商品的价值

最优方案就是比较这两种方案，哪个会更好些:

题目:洛谷P1060

上代码:

```c++
#include<iostream>
#include<algorithm>
using namespace std;
int w[30],v[30],f[50000];//w数组为重要度，v数组为money，f是用来dp的数组
int n,m;//n是总物品个数，m是总钱数
int main()
{
    cin>>m>>n;//输入
    for(int i=1;i<=n;i++)
    {
        cin>>v[i]>>w[i];
        w[i]*=v[i];//w数组在这里意义变为总收获（重要度*money）
    }//将每件物品的价值算出来,保留每件物品的价格(消耗背包空间)
    
    //01背包
    for(int i=1;i<=n;i++)//分别对n个物品单独分析,枚举放不放i号物品
    {
        for(int j=m;j>=v[i];j--)//注意从m开始,j>=v[i]的意思是:从大到小循环，
                               //依次询问使用这么多钱可获得的最大重要度与价格的乘积，
                              //循环到a[i]就行了,j代表的是使用j数量的钱的背包状况
        {
            if(j>=v[i])//剩的钱大于第i件产品的价格
            {
                f[j]=max(f[j],f[j-v[i]]+w[i]);//要不就不买,维持背包不变,
                //若是决定购买,将花完这个钱的背包里的价值加上现在这件产品的价值
            }
        }
    }
    cout<<f[m]<<endl;//背包大小为m时最大值,注意这个m,m可泛化为金钱等
    return 0;
} 
```

最长子序列和问题(HDU1003)

```c++
#include<iostream>



using namespace std;

int main() 
{
	//获取情况数
	int case_number = 0;
	cin >> case_number;
	int number_of_sequence = 0;
	int sum = -1001;//输出的求和
	int temp_sum = 0;//临时求和
	int get_number = 0;//获得的数字
	int counter = 1;//序列长度
	int start_position;//起始位置
	int final_counter = 0;//最终序列长度
	int final_startpos = 0;//最终起始位置
	for (int i = 0; i < case_number; i++)//每种情况对应的循环
	{
		counter = 1;
		final_counter = 0;
		final_startpos = 0;
		sum = -1001;
		cin >> number_of_sequence;//获取数组数字数目
		temp_sum = 0;
		start_position = 1;
		for (int j = 0; j < number_of_sequence; j++)//核心求和算法
		{
			
			cin >> get_number;
			temp_sum += get_number;
			
			if (temp_sum> sum)
			{
				sum = temp_sum;
				final_counter = counter;
				final_startpos = start_position;
			}
			if (temp_sum <0)
			{
				temp_sum = 0;
				counter = 0;
				start_position = j + 2;
			}
			
			counter++;
		
		}
		
		cout << "Case" << " " << i+1 << ":" << "\n";
		cout << sum << " " << final_startpos << " " << final_startpos + final_counter - 1 ;
		//输出结束
		cout << "\n";
		//空行
		if (i != (case_number - 1))
		{
			cout << "\n";
		}

	}

}
```



## 图论

图论是一个很重要的把抽象问题转发为程序的思想.我们在此处会举一些例子来说明图论的应用.有关这个数据结构的解释可以在后面的[数据结构](#数据结构)章节找到

图论的一些应用:

//还没学,先放着.

## 高精度算法

高精度算法可用于求解大数运算,这是任何一种数据类型(包括longl ong)都无法做到的,接下来就先贴几个代码来解释,以后再来写详细的笔记.

高精度加法(HDU1002)

```c++
#include <iostream>
#include <cstdint>
#include <string>
#include <vector>

using namespace std;

int main()
{
	//Get case number
	int case_number = 0;
	cin >> case_number;
	//Get input numbers  of each case
	//开始输出结果
	for (int i = 0; i < case_number; i++)
	{

		string num_a;
		string num_b;
		cin >> num_a;
		cin >> num_b;
		//Start caculate
		//Confirm length
		int length = 0;
		if (num_a.length() >= num_b.length())
		{
			length = num_a.length() + 1;
		}
		else if (num_a.length() < num_b.length())
		{
			length = num_b.length() + 1;
		}
		//Creat result
		vector<int> result(length);
		int nextline = 0; //进位
		int ifline = 0;
		int Tresult = 0; //每位结果
		int numberA = 0; //A的位
		int numberB = 0; //B的位
		//开始读数
		for (int j = 0; j < length; j++)
		{
			numberA = (num_a.length() - j - 1); //A读数的位
			numberB = (num_b.length() - j - 1); //B读数的位
			int tempA = 0;						//A临时读数
			int tempB = 0;						//B临时读数
			//读A
			if (numberA >= 0)
			{
				tempA = num_a[numberA];
				tempA = tempA - '0';
			}
			//读B
			if (numberB >= 0)
			{
				tempB = num_b[numberB];
				tempB = tempB - '0';
			}
			//Input result
			int tempR = 0;

			if (j == 0)
			{
				tempR = tempA + tempB; //在不进位时结果
			}
			else
			{
				tempR = tempA + tempB + nextline; //进位结果
			}

			//判断大于10

			if (j != (length - 1))
			{
				if (tempR >= 10)
				{
					ifline = 1;
					//取模结果输出
					tempR = tempR % 10;
				}
				else if (tempR < 10)
				{
					ifline = 0;
				}
			}

			int number = length - j - 1;

			Tresult = tempR;

			result[number] = Tresult;
			if (ifline == 1)
			{
				nextline = 1;
			}
			else
			{
				nextline = 0;
			}
		}
		//Output results

		cout << "Case " << i + 1 << ":"
			 << "\n";
		cout << num_a << " + " << num_b << " = ";
		int startout = 0;

		for (int l = 1; l < length; l++) //输出一个数
		{

			if (result[0] != 0 && l == 1)
			{
				cout << result[0];
				startout = 1;
			}
			if (result[l] != 0)
			{
				startout = 1;
			}
			else if (l == (length - 1))
			{
				startout = 1;
			}

			if (startout == 0)
			{
				continue;
			}
			cout << result[l];
		}
		//输出结束
		cout << "\n";
		//空行
		if (i != (case_number - 1))
		{
			cout << "\n";
		}

	} //结束单个循环
	return 0;
}

```

这个算法嘛,写的其实很累赘,但是其中一些进位和控制输出体现了高精度算法所要求的强大的逻辑性

高精度排序(洛谷P1781)

```c++
#include <bits/stdc++.h>

using namespace std;

char president[20][101];
int bits_number = 0;

bool compare(int a, int b)
{
    return president[a][bits_number] > president[b][bits_number];
};

int main()
{
    int number = 0;
    cin >> number;
    for (int i = 0; i < number; i++) //Get the votes of president
    {
        cin >> president[i];
    }
    //ok,let's compare
    queue<int> president_list; // the presidents left

    int maxbit = 0; // the max votes bit president

    for (int i = 0; i < number; i++) //get the bits of each president
    {
        int temp_bits = 0;
        for (int j = 0; j < 100; j++) // get the bits
        {
            if (president[i][j] != 0)
            {
                temp_bits++;
            }
            else
            {
                break;
            }
        }
        //this guy's bit has been recorded
        if (temp_bits >= maxbit)
        {
            
            president_list.push(i);
            if (temp_bits > maxbit)
            {
                president_list = queue<int>();
                president_list.push(i);
            }
            maxbit = temp_bits;
        }
    }
    //WARNING: THE NUMBER OF PRESIDENT MUST BE PLUSED ONE!
    //now,compare the president in queue!
    vector<int> last_list;
    while (!president_list.empty())
    {
        last_list.push_back(president_list.front());
        president_list.pop();
    }
    for (int i = 0; i < maxbit; i++)
    {
        bits_number = i;
        sort(last_list.begin(), last_list.end(), compare);
        int erase_bit = president[last_list[0]][i];

        for (auto it = last_list.begin(); it != last_list.end(); it++)
        {
            cout << "";
            if (president[*it][i] < erase_bit)
            {
                last_list.erase(it);
                it--;
                cout << "";
            }
        }
    }
    cout << last_list[0] + 1 << endl;
    for (int i = 0; i < maxbit; i++)
    {
        cout << president[last_list[0]][i];
    }

    return 0;
}
```

当然,可以学一门Java/python来应付这个......

这个我们后面可能会开Java/python的笔记.



