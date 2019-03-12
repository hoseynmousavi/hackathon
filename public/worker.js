self.addEventListener('push', event =>
{
    console.log('sending')
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
    })
})