alias gs="git status"
alias status="gs"

alias ga="git add"
alias add="ga"
alias gaa="git add --all"
alias add-all="gaa"

alias gc="git commit -m"
alias commit="gc"

alias gp="git push"
alias push="gp"
alias gfp="git push --force-with-lease"
alias gpf="gfp"
alias force-push="gfp"

alias checkout="git checkout"
alias check="checkout"

alias branches="git branch -a"

alias gd="git diff HEAD"
alias diff="gd"

help() {
  printf "giterm help\n_____________\n\n"
  CNT=$(expr $(cat $GITERM_RC | wc -l) - 5)
  head -n "$CNT" $GITERM_RC
}