const fs = require('fs');

const commands = JSON.parse(fs.readFileSync('public/json/commands.json', 'utf8'));

const translations = {
    // Portuguese to English translations
    'Altere seu "Sobre Mim" no meu comando de perfil!.': 'Change your "About Me" in my profile command!',
    'Aplica uma advertência/aviso em um usuário do servidor.': 'Apply a warning/notice to a server user.',
    'Edita o motivo de uma advertência/aviso do servidor.': 'Edit the reason for a warning/notice on the server.',
    'Exibe as advertências/avisos de um usuário no servidor.': 'Display warnings/notices for a user on the server.',
    'Exibe as informações de uma advertência de um usuário.': 'Display information about a user\'s warning.',
    'Remove uma advertência/aviso do histórico servidor.': 'Remove a warning/notice from server history.',
    'Remove as advertências/avisos de um usuário do servidor.': 'Remove warnings/notices for a user from the server.',
    'Remove a última advertência/aviso de um usuário.': 'Remove the last warning/notice from a user.',
    'Remove um número de advertências/avisos de um usuário.': 'Remove a number of warnings/notices from a user.',
    'Remove todas as advertências/avisos de um usuário.': 'Remove all warnings/notices from a user.',
    'Bane um usuário do servidor.': 'Ban a user from the server.',
    'Pune um usuário usando a menção.': 'Punish a user using mention.',
    'Pune um usuário usando o id.': 'Punish a user using their ID.',
    'Pune um usuário usando com um motivo.': 'Punish a user with a reason.',
    'Pune um usuário sem notificar via dm.': 'Punish a user without DM notification.',
    'usuário': 'user'
};

function translateCommands(commands) {
    return commands.map(command => {
        // Translate description
        if (translations[command.description]) {
            command.description = translations[command.description];
        }

        // Translate examples
        if (command.examples && Array.isArray(command.examples)) {
            command.examples = command.examples.map(example => {
                if (typeof example === 'object' && example.title) {
                    if (translations[example.title]) {
                        example.title = translations[example.title];
                    }
                }
                return example;
            });
        }

        return command;
    });
}

commands.commands = translateCommands(commands.commands);

fs.writeFileSync('public/json/commands.json', JSON.stringify(commands, null, 4), 'utf8');
console.log('Commands translated successfully!');
