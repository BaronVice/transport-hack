import * as React from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// импортируем стили mapbox-gl чтобы карта отображалась коррекно

function MapboxMap() {
	// здесь будет хранится инстанс карты после инициализации
	const NEXT_PUBLIC_MAPBOX_TOKEN =
		'pk.eyJ1Ijoic2ZhMjM0IiwiYSI6ImNsdmhyOGZkNTAxMWgya21rMzFtZWpzajgifQ.CmrrgQGEqG4HPPV3CnlH8A'
	const [map, setMap] = React.useState<mapboxgl.Map>()

	// React ref для хранения ссылки на DOM ноду который будет
	// использоваться как обязательный параметр `container`
	// при инициализации карты `mapbox-gl`
	// по-умолчанию будет содержать `null`
	const mapNode = React.useRef(null)

	React.useEffect(() => {
		const node = mapNode.current
		// если объект window не найден,
		// то есть компонент рендерится на сервере
		// или dom node не инициализирована, то ничего не делаем
		if (typeof window === 'undefined' || node === null) return

		// иначе создаем инстанс карты передавая ему ссылку на DOM ноду
		// а также accessToken для mapbox
		const mapboxMap = new mapboxgl.Map({
			container: node,
			accessToken: NEXT_PUBLIC_MAPBOX_TOKEN,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [104.2833, 52.2833],
			zoom: 12,
		})

		// и сохраняем созданный объект карты в React.useState
		setMap(mapboxMap)

		// чтобы избежать утечки памяти удаляем инстанс карты
		// когда компонент будет демонтирован
		return () => {
			mapboxMap.remove()
		}
	}, [])

	return <div ref={mapNode} style={{ width: '100%', height: '100%' }} />
}

export default MapboxMap
