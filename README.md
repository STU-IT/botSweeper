# botSweeper
How to script a bot to "win" a game

Du kan læse om ideen og om baggrundsviden i dokumentet [baggrund.md](./baggrund.md).

## Uzi Kilon's minesweeper

Jeg har rippet Uzi Kilons implementation af Minesweeper til dette formål, fra sitet <http://kilon.org/samples/minesweeper.html>.

På Uzi's side er selve spillepladen repræsenteret i en html-tabel med `id=minesweeper`. Antallet af miner skrives i input-feltet med `id=bombs`.

Begge disse samles op i variablerne `gameBoard` og `numBombs`, når programmet starter.  
For hver tur aflæses tilstandene for hvert felt på spillepladen igen, så vi altid er up-to-date med hvad der er af miner etc.

