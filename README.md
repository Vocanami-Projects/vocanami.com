# 開発の流れ
- 新規要素やバグ修正の開発は、developブランチで開発要素名のブランチを作成し、開発を行う。
- バグ修正のみの開発は、developブランチでバグ修正名のブランチを作成し、開発を行う。
- 開発が完了したら、開発したブランチをmainブランチにマージする。
- マージが完了したら、開発したブランチを削除する。

## ブランチの作成
### 1. developブランチに切り替える
`git switch develop`

### 2. developブランチを最新の状態にする（共同作業では特に重要）
`git pull origin develop`

### 3. 例えば、'feature/update-readme' という名前でブランチを作成し、切り替える
`git switch -c feature/update-readme`

### 4. 開発を行う

### 5. 開発が完了したら、開発したブランチをdevelopブランチにマージする
`git push origin feature/update-readme`

### 6. マージが完了したら、開発したブランチを削除する
`git branch -d feature/update-readme`

### 7. GitHub上のブランチも削除する
`git push origin --delete feature/update-readme`

※ この一連の作業は、開発したブランチをリモートリポジトリに反映させるための作業です。