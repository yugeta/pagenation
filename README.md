Pagenation
==
```
Author : Yugeta.Koji
Date   : 2020.06.02
```

# Summary
Pagination function for large list display


# View-Pattern

1. page-lists (max-count)
[1] 2 3 4 5 ..
- max-count : maxximam number is arbitary.


2. page-lists + prev&next
< 1 [2] 3 4 5 .. >
- prev , next : 1 page fiber.


3. page-lists + prev&next + first&last
<< < 1 2 [3] 4 5 .. > >>
- first , last : page-1st , page-last link.


4. prev&next , page-lists(between,max-count)
< 1 .. 5 [6] 7 .. 10 >
- between : Show start and end with maximum number.


5. Google like
前へ < 1 2 3 4 > 次へ

  * 注意
  - パターン４を前提んい初期構築
  - prev,nextは、Googleパターンもできるように、文字切り替えも可能にする。


# Setting-Pattern

1. url-query-link

2. 


# word

- item
表示するリストの総数 （１ページに１０個リスト表示が１０リンクあれば、100item）

- page
ページネーションのリンク１単位


# page_count-Pattern

base : 1 2 3 4 5 6 7 8 9 10

max-5 -> × : 1 .. 3 4 [5] 6 7  .. 10
max-5 -> ○ : 1 .. 4 [5] 6  .. 10

- 中間max-5(first-last)表示パターン
1)  [1] 2 3 4 5 .. 10
2)  1 [2] 3 4 5 .. 10
3)  1 2 [3] 4 5 .. 10
4)  1 2 3 [4] 5 6 .. 10
5)  1 .. 3 4 [5] 6 7 .. 10
6)  1 .. 4 5 [6] 7 8 .. 10
7)  1 .. 5 6 [7] 8 9 10
8)  1 .. 6 7 [8] 9 10
9)  1 .. 6 7 8 [9] 10
10) 1 .. 6 7 8 9 [10]

- 中間max-5表示パターン（表示数を考慮してこっちのほうがいいかも。）
1)  [1] 2 3 4 .. 10     : 前方処理
2)  1 [2] 3 4 .. 10     : 前方処理
3)  1 2 [3] 4 .. 10     : 前方処理
4)  1 .. 3 [4] 5 .. 10  : 中間処理
5)  1 .. 4 [5] 6 .. 10  : 中間処理
6)  1 .. 5 [6] 7 .. 10  : 中間処理
7)  1 .. 6 [7] 8 .. 10  : 中間処理
8)  1 .. 7 [8] 9 10     : 後方処理
9)  1 .. 7 8 [9] 10     : 後方処理
10) 1 .. 7 8 9 [10]     : 後方処理





