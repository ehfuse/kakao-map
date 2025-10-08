# API 레퍼런스

## 컴포넌트

### Map

지도를 표시하는 메인 컴포넌트입니다.

```tsx
import { Map } from "@ehfuse/kakao-map";

<Map
    center={{ lat: 37.5665, lng: 126.978 }}
    level={3}
    style={{ width: "100%", height: "400px" }}
/>;
```

#### Props

| Prop                     | 타입                                            | 기본값       | 설명                       |
| ------------------------ | ----------------------------------------------- | ------------ | -------------------------- |
| `center`                 | [`KakaoPosition`](#kakaoposition)               | 필수         | 지도 중심 좌표             |
| `level`                  | `number`                                        | `3`          | 지도 확대 레벨 (1~14)      |
| `style`                  | `CSSProperties`                                 | -            | 지도 컨테이너 스타일       |
| `className`              | `string`                                        | -            | CSS 클래스명               |
| `apiKey`                 | `string`                                        | -            | Kakao API 키 (동적 로드시) |
| `draggable`              | `boolean`                                       | `true`       | 드래그 가능 여부           |
| `zoomable`               | `boolean`                                       | `true`       | 확대/축소 가능 여부        |
| `wheelZoom`              | `boolean`                                       | `true`       | 마우스 휠 줌 가능 여부     |
| `zoomControl`            | `boolean`                                       | `false`      | 줌 컨트롤 표시 여부        |
| `zoomControlPosition`    | [`KakaoControlPosition`](#kakaocontrolposition) | `'RIGHT'`    | 줌 컨트롤 위치             |
| `mapTypeControl`         | `boolean`                                       | `false`      | 지도 타입 컨트롤 표시 여부 |
| `mapTypeControlPosition` | [`KakaoControlPosition`](#kakaocontrolposition) | `'TOPRIGHT'` | 지도 타입 컨트롤 위치      |
| `traffic`                | `boolean`                                       | `false`      | 교통정보 표시 여부         |
| `terrain`                | `boolean`                                       | `false`      | 지형정보 표시 여부         |
| `clusterer`              | `boolean`                                       | `false`      | 마커 클러스터링 활성화     |

#### 이벤트

| Event             | 타입                                                   | 설명           |
| ----------------- | ------------------------------------------------------ | -------------- |
| `onCreate`        | `(map: KakaoMap) => void`                              | 지도 생성 완료 |
| `onClick`         | `(mouseEvent: KakaoMouseEvent, map: KakaoMap) => void` | 지도 클릭      |
| `onRightClick`    | `(mouseEvent: KakaoMouseEvent, map: KakaoMap) => void` | 지도 우클릭    |
| `onDragStart`     | `(map: KakaoMap) => void`                              | 드래그 시작    |
| `onDragEnd`       | `(map: KakaoMap) => void`                              | 드래그 종료    |
| `onZoomChanged`   | `(map: KakaoMap) => void`                              | 줌 레벨 변경   |
| `onCenterChanged` | `(map: KakaoMap) => void`                              | 중심 좌표 변경 |

---

### MapMarker

지도에 마커를 표시하는 컴포넌트입니다.

```tsx
import { MapMarker } from "@ehfuse/kakao-map";

<MapMarker position={{ lat: 37.5665, lng: 126.978 }} title="서울시청" />;
```

#### Props

| Prop        | 타입                              | 기본값  | 설명                                             |
| ----------- | --------------------------------- | ------- | ------------------------------------------------ |
| `position`  | [`KakaoPosition`](#kakaoposition) | 필수    | 마커 위치                                        |
| `title`     | `string`                          | -       | 마커 타이틀 (호버시 표시)                        |
| `clickable` | `boolean`                         | `false` | 클릭 가능 여부 (onClick 있으면 자동 true)        |
| `draggable` | `boolean`                         | `false` | 드래그 가능 여부                                 |
| `zIndex`    | `number`                          | -       | z-index 값                                       |
| `opacity`   | `number`                          | `1`     | 투명도 (0~1)                                     |
| `visible`   | `boolean`                         | `true`  | 표시 여부                                        |
| `clustered` | `boolean`                         | `auto`  | 클러스터 포함 여부 (Map의 clusterer 설정에 따름) |

#### 커스텀 이미지

| Prop                   | 타입                                | 설명                                            |
| ---------------------- | ----------------------------------- | ----------------------------------------------- |
| `image.src`            | `string \| ReactElement`            | 이미지 URL, SVG 문자열, 또는 React SVG 컴포넌트 |
| `image.size`           | `{ width: number, height: number }` | 이미지 크기                                     |
| `image.options.offset` | `{ x: number, y: number }`          | 이미지 오프셋                                   |

```tsx
// URL
<MapMarker
    position={pos}
    image={{
        src: 'https://example.com/marker.png',
        size: { width: 40, height: 40 }
    }}
/>

// React SVG 컴포넌트
<MapMarker
    position={pos}
    image={{
        src: <NumberedMarker number={1} color="#ff0000" />,
        size: { width: 36, height: 36 }
    }}
/>
```

#### 이벤트

| Event         | 타입                            | 설명        |
| ------------- | ------------------------------- | ----------- |
| `onClick`     | `(marker: KakaoMarker) => void` | 마커 클릭   |
| `onMouseOver` | `(marker: KakaoMarker) => void` | 마우스 오버 |
| `onMouseOut`  | `(marker: KakaoMarker) => void` | 마우스 아웃 |
| `onDragStart` | `(marker: KakaoMarker) => void` | 드래그 시작 |
| `onDragEnd`   | `(marker: KakaoMarker) => void` | 드래그 종료 |

---

### InfoWindow

마커에 정보창을 표시하는 컴포넌트입니다.

```tsx
import { InfoWindow } from "@ehfuse/kakao-map";

<MapMarker position={pos}>
    <InfoWindow>
        <div>서울시청</div>
    </InfoWindow>
</MapMarker>;
```

#### Props

| Prop        | 타입                              | 기본값  | 설명                                  |
| ----------- | --------------------------------- | ------- | ------------------------------------- |
| `position`  | [`KakaoPosition`](#kakaoposition) | -       | 정보창 위치 (마커 자식이면 생략 가능) |
| `content`   | `ReactNode \| string`             | -       | 정보창 내용                           |
| `removable` | `boolean`                         | `false` | 닫기 버튼 표시 여부                   |
| `zIndex`    | `number`                          | -       | z-index 값                            |

#### 이벤트

| Event          | 타입         | 설명           |
| -------------- | ------------ | -------------- |
| `onCloseClick` | `() => void` | 닫기 버튼 클릭 |

---

### CustomOverlayMap

지도에 커스텀 HTML 오버레이를 표시하는 컴포넌트입니다.

```tsx
import { CustomOverlayMap } from "@ehfuse/kakao-map";

<CustomOverlayMap position={{ lat: 37.5665, lng: 126.978 }}>
    <div style={{ padding: "10px", background: "white" }}>커스텀 오버레이</div>
</CustomOverlayMap>;
```

#### Props

| Prop       | 타입                              | 기본값 | 설명              |
| ---------- | --------------------------------- | ------ | ----------------- |
| `position` | [`KakaoPosition`](#kakaoposition) | 필수   | 오버레이 위치     |
| `content`  | `ReactNode \| string`             | -      | 오버레이 내용     |
| `xAnchor`  | `number`                          | `0.5`  | 가로 기준점 (0~1) |
| `yAnchor`  | `number`                          | `0.5`  | 세로 기준점 (0~1) |
| `zIndex`   | `number`                          | -      | z-index 값        |
| `visible`  | `boolean`                         | `true` | 표시 여부         |

---

## 훅

### useKakaoMap

Kakao Maps의 모든 기능을 제공하는 All-in-One 훅입니다.

```tsx
import { useKakaoMap } from "@ehfuse/kakao-map";

// 비즈니스 로직 상태 타입 정의
interface MyMapState {
    selectedPlace: { lat: number; lng: number; name: string } | null;
    searchResults: any[];
}

const { map, state, searchAddress, createMarker } = useKakaoMap<MyMapState>({
    stateId: "my-map",
    initialValues: {
        selectedPlace: null,
        searchResults: [],
    },
});
```

#### Options

| Option          | 타입         | 설명                                            |
| --------------- | ------------ | ----------------------------------------------- |
| `stateId`       | `string`     | 상태 관리 ID (같은 ID는 상태 공유)              |
| `initialValues` | `Partial<T>` | 초기 상태 값 (비즈니스 로직 상태, 맵 옵션 아님) |

#### 반환값

| Property  | 타입               | 설명                                             |
| --------- | ------------------ | ------------------------------------------------ |
| `isReady` | `boolean`          | Kakao Maps API 로드 완료 여부                    |
| `map`     | `KakaoMap \| null` | Map 인스턴스 (Map 컴포넌트 내부에서만 사용 가능) |
| `state`   | `FormaState<T>`    | forma 상태 관리 객체                             |

#### 좌표 관련

| Method          | 시그니처                                                                      | 설명                   |
| --------------- | ----------------------------------------------------------------------------- | ---------------------- |
| `parsePosition` | `(position: `[`KakaoPosition`](#kakaoposition)`) => KakaoLatLngInstance \| null` | 좌표 변환              |
| `getDistance`   | `(pos1: `[`KakaoPosition`](#kakaoposition)`, pos2: `[`KakaoPosition`](#kakaoposition)`) => number`     | 두 지점 간 거리 (미터) |

#### 검색 함수

| Method          | 시그니처                                                                        | 설명               |
| --------------- | ------------------------------------------------------------------------------- | ------------------ |
| `searchAddress` | `(address: string) => Promise<KakaoSearchResult>`                               | 주소 → 좌표 검색   |
| `searchPlace`   | `(keyword: string) => Promise<KakaoPlaceResult[]>`                              | 키워드로 장소 검색 |
| `coord2Address` | `(position: `[`KakaoPosition`](#kakaoposition)`) => Promise<{address: string, roadAddress?: string}>` | 좌표 → 주소 변환   |

```tsx
// 주소 검색
const result = await searchAddress("서울시청");
// { address: '서울특별시 중구 태평로1가 31', lat: 37.5665, lng: 126.978 }

// 장소 검색
const places = await searchPlace("카페");
// [{ place_name: '스타벅스', address_name: '...', x: '...', y: '...' }, ...]

// 역지오코딩
const address = await coord2Address({ lat: 37.5665, lng: 126.978 });
// { address: '서울특별시 중구 태평로1가 31', roadAddress: '서울특별시 중구 세종대로 110' }
```

#### 마커 생성

| Method         | 시그니처                                                                    | 설명      |
| -------------- | --------------------------------------------------------------------------- | --------- |
| `createMarker` | `(position: `[`KakaoPosition`](#kakaoposition)`, options?: MarkerOptions) => KakaoMarker \| null` | 마커 생성 |

```tsx
const marker = createMarker(
    { lat: 37.5665, lng: 126.978 },
    {
        title: "서울시청",
        clickable: true,
        image: {
            src: "https://example.com/marker.png",
            size: { width: 40, height: 40 },
        },
    }
);
```

#### 고급 API

| Method        | 시그니처                      | 설명                           |
| ------------- | ----------------------------- | ------------------------------ |
| `getGeocoder` | `() => KakaoGeocoder \| null` | Geocoder 인스턴스 (저수준 API) |
| `getPlaces`   | `() => KakaoPlaces \| null`   | Places 인스턴스 (저수준 API)   |

---

## 타입

### KakaoPosition

```typescript
type KakaoLatLng = { lat: number; lng: number };
type KakaoPoint = { x: number; y: number };
type KakaoPosition = KakaoLatLng | KakaoPoint;
```

### KakaoControlPosition

```typescript
type KakaoControlPosition =
    | "TOPLEFT"
    | "TOP"
    | "TOPRIGHT"
    | "LEFT"
    | "CENTER"
    | "RIGHT"
    | "BOTTOMLEFT"
    | "BOTTOM"
    | "BOTTOMRIGHT";
```

### MapState

```typescript
interface MapState {
    center?: KakaoLatLng;
    level?: number;
    zoomControl?: boolean;
    zoomControlPosition?: KakaoControlPosition;
    mapTypeControl?: boolean;
    mapTypeControlPosition?: KakaoControlPosition;
    draggable?: boolean;
    wheelZoom?: boolean;
    traffic?: boolean;
    terrain?: boolean;
}
```

> **참고**: [`KakaoLatLng`](#kakaoposition)는 `{ lat: number; lng: number }` 형태입니다.  
> [`KakaoControlPosition`](#kakaocontrolposition)은 컨트롤 위치를 나타내는 문자열 타입입니다.

---

## 상태 관리 (forma)

`useKakaoMap`은 [@ehfuse/forma](https://github.com/ehfuse/forma)를 사용하여 비즈니스 로직 상태를 관리합니다.

> ⚠️ **주의**: `initialValues`는 **비즈니스 로직 상태**를 위한 것입니다. 맵 옵션(`center`, `level` 등)은 `Map` 컴포넌트의 props로 전달하세요.

```tsx
// 비즈니스 로직 상태 타입 정의
interface MyMapState {
    selectedPlace: { lat: number; lng: number; name: string } | null;
    markers: Array<{ id: string; position: { lat: number; lng: number } }>;
}

const { state } = useKakaoMap<MyMapState>({
    stateId: "my-map",
    initialValues: {
        selectedPlace: null,
        markers: [],
    },
});

// 값 읽기 (반응형 - 변경시 리렌더링)
const selectedPlace = state.useValue("selectedPlace");
const markers = state.useValue("markers");

// 값 쓰기
state.setValue("selectedPlace", { 
    lat: 37.4979, 
    lng: 127.0276,
    name: "강남역" 
});
state.setValue("markers", [...markers, newMarker]);

// 여러 값 동시 변경
state.setValues({
    center: { lat: 37.4979, lng: 127.0276 },
    level: 5,
});
```

### 상태 공유

같은 `stateId`를 사용하는 컴포넌트들은 상태를 공유합니다:

```tsx
// ComponentA.tsx
const { state } = useKakaoMap({ stateId: "shared-map" });

// ComponentB.tsx
const { state } = useKakaoMap({ stateId: "shared-map" });
// ↑ 같은 stateId → 같은 상태 공유
```
