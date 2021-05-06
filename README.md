![](https://trello-attachments.s3.amazonaws.com/5c176c03b4ac6d35e24cddc4/5ea09dd8dd8d42431aa93dfd/059d197439e28a87319249a07679b5db/dwaps-132.png)

## [VERSION BETA] Extension VSCode: Discord Sharing Code

Support pédagogique de formation: outil permettant l'envoi d'exemples de code aux élèves. ([Vidéo de présentation](https://www.youtube.com/watch?v=ukrWtrl47kQ))

---

### Installation

1. CRÉEZ UN BOT DISCORD: [https://discord.com/developers/applications](https://discord.com/developers/applications)
![](https://trello-attachments.s3.amazonaws.com/59622f48b1b57f3517e67f5d/6092e23f33fb8f4dd48170f3/43664a0216d3221158be749f3d46344b/ss-create-app.png)
2. RÉCUPÉREZ :

      ▶︎ l'identifiant de l'application dans le menu *'General Information'*.
![](https://trello-attachments.s3.amazonaws.com/59622f48b1b57f3517e67f5d/6092e23f33fb8f4dd48170f3/71fb514d987ad4ef87b83b39f491eca8/ss-app-id.png)
    ▶︎ le token de votre bot Discord depuis le menu *'Bot'*.
![](https://trello-attachments.s3.amazonaws.com/59622f48b1b57f3517e67f5d/6092e23f33fb8f4dd48170f3/febb4453c38112def18f669c97c06c60/ss-bot-token.png)
    ▶︎ l'identifiant du salon textuel de votre choix.
![](https://trello-attachments.s3.amazonaws.com/59622f48b1b57f3517e67f5d/6092e23f33fb8f4dd48170f3/614d6faba1cd3b0c49a53ecbfddc10d4/ss-id-channel.png)

3. Lancez la commande **"Dwaps: Initialize Extension"** `(Ctrl+Shift+P ou Cmd+Shift+P)` et entrez les informations pour initialiser votre extension VSCode.<br><br>

4. Lancez la commande  **"Dwaps: Connect Bot to a Discord Server"** `(Ctrl+Shift+P ou Cmd+Shift+P)` pour vous connecter au serveur de votre choix.

---

### Utilisation

Pour partager du code, il suffit de se positionner dans le fichier de son choix et de lancer la commande VSCode **"Dwaps: Share Code"** `(Ctrl+Shift+P ou Cmd+Shift+P)`.

**Remarque:**
A tout moment, vous pouvez mettre à jour l'identifiant du salon textuel via la commande VSCode **"Dwaps: Update Channel"**.

---

### Raccourcis claviers

(Pour Mac: `Ctrl` ==> `Cmd`)

| Commande | Raccourci |
| - | - | - |
| Dwaps: Initialize Extension             | `Ctrl+i Ctrl+i` |
| Dwaps: Connect Bot to a Discord Server  | `Ctrl+o Ctrl+o` |
| Dwaps: Update Channel                   | `Ctrl+u Ctrl+u` |
| Dwaps: Share Code                       | `Ctrl+c Ctrl+c` |

---

### Remarque

Dans une prochaine mise à jour, j'ajouterais la possibilité de renseigner les divers éléments de configuration via les settings de VSCode (ce qui sera beaucoup plus confortable). En attendant, si vous rencontrez des difficultés à entrer vos informations vous pouvez suivre la petite astuce ci-dessous.

Pour renseigner l'**app id**, le **bot token** et le **channel id** au moment de la configuration initiale de l'extension (via la commande **"Dwaps: Initialize Extension"**): créez une seule chaine de caractère avec vos identifants du genre `XXXAPP_IDXXX XXXBOT_TOKENXXX XXXCHANNEL_IDXXX` (exemple: `778855664455334422 7Dh7885ik56644OO55ULOp22.YHa7ZQ.77885yHtYIiuiAYfGGvREt22-Z 778855664455334422`).

Il vous suffira ensuite de copier toute la chaine lors des demandes de renseignements, et de la réduire en coupant les infos en trop pour pouvoir les recoller à la question suivante. Ainsi de suite... Si vous rencontrez des difficultés à saisirs vos infos, n'hésitez pas à me contacter pour que je vous explique la démarche.

Désolé d'avance pour ce manque d'ergonomie mais j'ai comme excuse que l'extension est en version bêta: je ferais mon possible pour l'améliorer rapidement ! 🙂

---

[® DWAPS Formation - Michael Cornillon](https://dwaps.fr "DWAPS")
