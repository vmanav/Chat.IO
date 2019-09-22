// alert('this is t1.js');

// User Entered notification
var name = 'Manav';
new Noty({

    type: 'success',
    layout: 'bottomRight',
    theme: 'metroui',
    text: `${name} Joined the chat`,
    timeout: '2500',
    progressBar: true,
    closeWith: ['click'],
    killer: false,
    animation: {
        open: 'animated bounceInRight', // Animate.css class names
        close: 'animated pulse' // Animate.css class names
    }

}).show();



// User Left notification
var name = 'Manav';
new Noty({

    type: 'error',
    layout: 'bottomLeft',
    theme: 'metroui',
    text: `${name} Left the chat`,
    timeout: '2000',
    progressBar: true,
    closeWith: ['click'],
    killer: false,
    animation: {
        open: 'animated bounceInLeft', // Animate.css class names
        close: 'animated fadeOut' // Animate.css class names
    }

}).show();
