export function analysis() {
    const isLocal = process.env.NODE_ENV === 'development'
    if (isLocal) {
      return []
    }
    return [
      [
        'script',
        {
          src: 'https://umami.ricolxwz.io/script.js',
          defer: true,
          'data-website-id': '212ed47d-c05f-44c0-8ea4-2c8e1fd31862'
        }
      ]
    ]
  }