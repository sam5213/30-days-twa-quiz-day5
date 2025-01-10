const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');


const bot = new Telegraf(process.env.BOT_TOKEN_30DAYS);


bot.start((ctx) => {
    ctx.reply('Выберите категорию вопросов:', Markup.keyboard([
        [Markup.button.webApp('Математика', 'https://sam5213.github.io/30-days-twa-quiz-day5/?category=math')],
        [Markup.button.webApp('Наука', 'https://sam5213.github.io/30-days-twa-quiz-day5/?category=science')]
    ]).resize());
});


const userIds = {
    user1: process.env.USER1_ID, 
    user2: 'USER2_ID'  // Заменить на еще реальный ID пользователя
};

// Обработчик для получения данных из веб-приложения
bot.on('web_app_data', (ctx) => {
    try {
        const data = ctx.message.web_app_data.data;
        const parsedData = JSON.parse(data); // Парсим данные
        console.log('Полученные данные:', parsedData);
        const currentUser = ctx.from.id;
        const message = `Пользователь ${currentUser ? ctx.from.username : currentUser} в качестве ответа выбрал: ${parsedData.answer}`; // Формируем сообщение
        console.log(message);

        // Отправляем сообщение другому пользователю
        console.log('Отправляем в чат:', userIds.user1);
        bot.telegram.sendMessage(userIds.user1, message) 
            .then(() => {
                ctx.reply('Ваш ответ был отправлен нам.');
            })
            .catch((error) => {
                console.error('Ошибка при отправке сообщения:', error);
                ctx.reply('Произошла ошибка при отправке сообщения.');
            });
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
        ctx.reply('Произошла ошибка при обработке вашего ответа.');
    }
});


bot.launch()
    .then(() => {
        console.log("Бот запущен!");
    })
    .catch((error) => {
        console.error("Ошибка при запуске бота: ", error);
    });
