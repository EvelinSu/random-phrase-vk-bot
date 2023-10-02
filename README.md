# Random Phrase VK Bot
Random Phrase VK Bot is a simple JS VKontakte group chat bot that generates random sentences (in this case, quotes), enables users to contribute their own sentences, and creates amusing phrases by combining nouns and adjectives from predefined arrays.

# Start db
json-server --watch db.json

## Compile ts to js
tsc .\src\index.ts

## Start bot
node .\src\index.js 