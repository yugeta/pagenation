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
[1] 2 3 4 5 ...
- max-count : maxximam number is arbitary.


2. page-lists + prev&next
< 1 [2] 3 4 5 ... >
- prev , next : 1 page fiber.


3. page-lists + prev&next + first&last
<< < 1 2 [3] 4 5 ... > >>
- first , last : page-1st , page-last link.


4. prev&next , page-lists(between,max-count)
< 1 .. 5 [6] 7 .. 10 >
- between : Show start and end with maximum number.


5. Google like
前へ < 1 2 3 4 > 次へ

  * 注意
  - パターン４を前提んい初期構築
  - prev,nextは、Googleパターンもできるように、文字切り替えも可能にする。



