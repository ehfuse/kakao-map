# Kakao Map React Component

React에서 Kakao Maps API를 쉽게 사용할 수 있는 컴포넌트 라이브러리입니다.

## 특징

-   🗺️ **선언적 API** - React 컴포넌트로 지도를 쉽게 구성
-   🎯 **TypeScript 지원** - 완벽한 타입 정의 제공
-   🪝 **강력한 Hooks** - `useKakaoMap`으로 모든 기능을 하나의 훅으로 사용
-   🎨 **커스터마이징** - 마커, 오버레이 등 자유롭게 커스터마이징
-   ⚡ **가벼운 의존성** - React와 React-DOM만 필요
-   📦 **클러스터링** - 많은 마커를 효율적으로 처리

## 설치

```bash
npm install @ehfuse/kakao-map
# or
yarn add @ehfuse/kakao-map
# or
pnpm add @ehfuse/kakao-map
```

## 빠른 시작

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        >
            <MapMarker position={{ lat: 37.5665, lng: 126.978 }} />
        </Map>
    );
}
```

## 주요 기능

### 컴포넌트

-   **Map** - 지도 표시
-   **MapMarker** - 마커 표시
-   **InfoWindow** - 정보창
-   **CustomOverlayMap** - 커스텀 HTML 오버레이

### 훅

-   **useKakaoMap** - 지도 기능과 상태 관리를 위한 All-in-One 훅

```tsx
const { map, state, searchAddress, createMarker } = useKakaoMap();
```

### 주요 API

| 기능                              | 설명                   |
| --------------------------------- | ---------------------- |
| `searchAddress(address)`          | 주소 → 좌표 검색       |
| `searchPlace(keyword)`            | 장소 검색              |
| `coord2Address(position)`         | 좌표 → 주소 변환       |
| `getDistance(pos1, pos2)`         | 두 지점 간 거리 계산   |
| `createMarker(position, options)` | 프로그래매틱 마커 생성 |

## 문서

-   📘 [시작하기](./docs/ko/getting-started.md) - 설치 및 기본 사용법
-   📗 [API 레퍼런스](./docs/ko/api.md) - 상세 API 문서
-   📙 [예제](./docs/ko/examples.md) - 다양한 사용 예제

## 예제

### 마커 클러스터링

```tsx
<Map clusterer={true}>
    {markers.map((marker) => (
        <MapMarker key={marker.id} position={marker} />
    ))}
</Map>
```

### 주소 검색

```tsx
import { useState } from "react";
import { useKakaoMap } from "@ehfuse/kakao-map";

const { searchAddress } = useKakaoMap();
const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });

const handleSearch = async () => {
    const result = await searchAddress("서울시청");
    setCenter({ lat: result.lat, lng: result.lng });
};
```

### 커스텀 마커

```tsx
<MapMarker
    position={{ lat: 37.5665, lng: 126.978 }}
    image={{
        src: <NumberedMarker number={1} color="#ff0000" />,
        size: { width: 36, height: 36 },
    }}
/>
```

더 많은 예제는 [예제 문서](./docs/ko/examples.md)를 참고하세요.

## TypeScript 지원

```tsx
import type { KakaoLatLng, MapProps, MapMarkerProps } from "@ehfuse/kakao-map";
```

완벽한 타입 정의와 자동 완성을 제공합니다.

## 라이선스

MIT License

## 기여하기

이슈와 PR은 언제나 환영합니다!

## 링크

-   [GitHub 저장소](https://github.com/ehfuse/kakao-map)
-   [Kakao Maps API 문서](https://apis.map.kakao.com/web/)
-   [예제 코드](./example)
