# yml

init:

git init
git add .
git commit -m "init"
git branch -M master
git remote add origin https://github.com/yang-math-league/yml.git
git push -u origin master


Deploy:

npm run build
cd dist
git init
git config user.name yang-math-league
git config user.email stephenyang.math@gmail.com
git add -A
git commit -m 'deploy'
git push -f https://github.com/yang-math-league/yang-math-league.github.io.git master
