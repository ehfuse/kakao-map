# API 레퍼런스

## 목차

### 컴포넌트

-   [Map](#map) - 지도 메인 컴포넌트
-   [MapMarker](#mapmarker) - 마커 컴포넌트
-   [InfoWindow](#infowindow) - 기본 정보창
-   [CustomInfoWindow](#custominfowindow) - React 커스텀 정보창
-   [CustomOverlayMap](#customoverlaymap) - 커스텀 오버레이

### 훅 (Hooks)

-   [useKakaoMap](#usekakaomap) - All-in-One 지도 훅
-   [useMapContext](#usemapcontext) - Map 컨텍스트 훅
-   [useMarkerContext](#usemarkercontext) - Marker 컨텍스트 훅

### 타입

-   [KakaoPosition](#kakaoposition) - 좌표 타입
-   [KakaoControlPosition](#kakaocontrolposition) - 컨트롤 위치 타입
-   [MapState](#mapstate) - 지도 상태 타입

### 기타

-   [상태 관리](#상태-관리) - 상태 관리 패턴

---

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

> 📖 **예제**: [기본 지도](./examples.md#기본-예제), [지도 컨트롤](./examples.md#지도-컨트롤)

#### Props

| Prop                     | 타입                                            | 기본값       | 설명                              |
| ------------------------ | ----------------------------------------------- | ------------ | --------------------------------- |
| `center`                 | [`KakaoPosition`](#kakaoposition)               | 필수         | 지도 중심 좌표                    |
| `level`                  | `number`                                        | `3`          | 지도 확대 레벨 (1~14)             |
| `style`                  | `CSSProperties`                                 | -            | 지도 컨테이너 스타일              |
| `className`              | `string`                                        | -            | CSS 클래스명                      |
| `apiKey`                 | `string`                                        | -            | Kakao API 키 (동적 로드시)        |
| `draggable`              | `boolean`                                       | `true`       | 드래그 가능 여부                  |
| `wheelZoom`              | `boolean`                                       | `true`       | 마우스 휠 줌 가능 여부            |
| `zoomControl`            | `boolean`                                       | `false`      | 줌 컨트롤 표시 여부               |
| `zoomControlPosition`    | [`KakaoControlPosition`](#kakaocontrolposition) | `'RIGHT'`    | 줌 컨트롤 위치                    |
| `mapTypeControl`         | `boolean`                                       | `false`      | 지도 타입 컨트롤 표시 여부        |
| `mapTypeControlPosition` | [`KakaoControlPosition`](#kakaocontrolposition) | `'TOPRIGHT'` | 지도 타입 컨트롤 위치             |
| `traffic`                | `boolean`                                       | `false`      | 교통정보 표시 여부                |
| `terrain`                | `boolean`                                       | `false`      | 지형정보 표시 여부                |
| `clusterer`              | `boolean`                                       | `false`      | 마커 클러스터링 활성화            |
| `closeInfoWindowOnClick` | `boolean`                                       | `false`      | 지도 클릭 시 InfoWindow 자동 닫기 |
| `width`                  | `number \| string`                              | `'100%'`     | 지도 너비                         |
| `height`                 | `number \| string`                              | `500`        | 지도 높이 (px)                    |

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

> 📖 **예제**: [마커 표시](./examples.md#기본-예제), [마커 클러스터링](./examples.md#마커-클러스터링), [인터랙티브 마커](./examples.md#인터랙티브-마커), [커스텀 마커 이미지](./examples.md#커스텀-마커-이미지)

#### Props

| Prop            | 타입                              | 기본값  | 설명                                             |
| --------------- | --------------------------------- | ------- | ------------------------------------------------ |
| `position`      | [`KakaoPosition`](#kakaoposition) | 필수    | 마커 위치                                        |
| `title`         | `string`                          | -       | 마커 타이틀 (호버시 표시)                        |
| `clickable`     | `boolean`                         | `true`  | 클릭 가능 여부                                   |
| `draggable`     | `boolean`                         | `false` | 드래그 가능 여부                                 |
| `zIndex`        | `number`                          | -       | z-index 값                                       |
| `opacity`       | `number`                          | `1`     | 투명도 (0~1)                                     |
| `visible`       | `boolean`                         | `true`  | 표시 여부                                        |
| `clustered`     | `boolean`                         | `auto`  | 클러스터 포함 여부 (Map의 clusterer 설정에 따름) |
| `centerOnClick` | `boolean`                         | `false` | 클릭 시 지도 중심 이동                           |
| `zoomOnClick`   | `number`                          | -       | 클릭 시 지도 줌 레벨 설정                        |
| `children`      | `ReactNode`                       | -       | InfoWindow 등 자식 컴포넌트                      |

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

> 📖 **예제**: [InfoWindow (정보창)](./examples.md#infowindow-정보창)

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

### CustomInfoWindow

React 컴포넌트를 content로 사용할 수 있는 정보창 컴포넌트입니다. `CustomOverlayMap`을 기반으로 InfoWindow 스타일링을 추가한 컴포넌트입니다.

```tsx
import { CustomInfoWindow } from "@ehfuse/kakao-map";

<MapMarker position={pos}>
    <CustomInfoWindow
        content={
            <div>
                <h3>서울시청</h3>
                <p>주소: 서울특별시 중구 세종대로 110</p>
            </div>
        }
    />
</MapMarker>;
```

> 📖 **예제**: [CustomInfoWindow](./examples.md#custominfowindow)

#### Props

| Prop           | 타입                              | 기본값 | 설명                                          |
| -------------- | --------------------------------- | ------ | --------------------------------------------- |
| `position`     | [`KakaoPosition`](#kakaoposition) | -      | 정보창 위치 (마커 자식이면 자동으로 설정됨)   |
| `content`      | `ReactElement \| string`          | 필수   | 정보창 내용 (React 컴포넌트 또는 HTML 문자열) |
| `style`        | `CSSProperties`                   | -      | 정보창 스타일                                 |
| `arrowStyle`   | `CSSProperties`                   | -      | 화살표 스타일                                 |
| `zIndex`       | `number`                          | `1000` | z-index 값                                    |
| `visible`      | `boolean`                         | `true` | 표시 여부                                     |
| `markerHeight` | `number`                          | `40`   | 마커 높이 (px) - 화살표 위치 계산에 사용      |
| `marker`       | `KakaoMarker`                     | -      | 마커 인스턴스 (내부 사용, 자동으로 설정됨)    |

#### 특징

-   **React 컴포넌트 지원**: JSX를 content로 직접 사용 가능
-   **이벤트 핸들러**: onClick 등 모든 React 이벤트 사용 가능
-   **Hooks 사용 가능**: useState, useEffect 등 모든 React Hooks 사용 가능
-   **자동 위치 설정**: MapMarker의 자식으로 사용 시 position과 marker 자동 설정
-   **자동 표시 관리**: 선택된 마커에만 자동으로 표시 (marker prop 사용 시)
-   **정확한 위치**: CSS absolute positioning으로 마커 위에 정확히 배치
-   **커스터마이징**: style, arrowStyle로 완전한 스타일 제어

#### 사용 예제

```tsx
// MapMarker의 자식으로 사용 (권장)
<MapMarker position={position}>
    <CustomInfoWindow
        content={
            <div>
                <h3>장소 정보</h3>
                <button onClick={() => console.log('클릭!')}>
                    상세보기
                </button>
            </div>
        }
    />
</MapMarker>

// 독립적으로 사용 (marker 인스턴스 전달)
<CustomInfoWindow
    marker={markerInstance}
    content={<MyCustomComponent data={data} />}
/>

// 또는 position 직접 지정
<CustomInfoWindow
    position={{ lat: 37.5665, lng: 126.978 }}
    content={<MyCustomComponent data={data} />}
/>

// 커스텀 마커 높이 지정
<MapMarker
    position={position}
    image={{ src: customIcon, size: { width: 50, height: 60 } }}
>
    <CustomInfoWindow
        markerHeight={60}  // 커스텀 마커 높이에 맞춤
        content={<div>커스텀 마커 정보</div>}
    />
</MapMarker>
```

---

### CustomOverlayMap

지도에 커스텀 HTML 오버레이를 표시하는 컴포넌트입니다.

```tsx
import { CustomOverlayMap } from "@ehfuse/kakao-map";

<CustomOverlayMap position={{ lat: 37.5665, lng: 126.978 }}>
    <div style={{ padding: "10px", background: "white" }}>커스텀 오버레이</div>
</CustomOverlayMap>;
```

> 📖 **예제**: [CustomOverlay](./examples.md#customoverlay)

#### Props

| Prop       | 타입                              | 기본값 | 설명          |
| ---------- | --------------------------------- | ------ | ------------- |
| `position` | [`KakaoPosition`](#kakaoposition) | 필수   | 오버레이 위치 |
| `content`  | `ReactNode \| string`             | -      | 오버레이 내용 |
| `zIndex`   | `number`                          | -      | z-index 값    |
| `visible`  | `boolean`                         | `true` | 표시 여부     |

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

> 📖 **예제**: [주소 검색](./examples.md#주소-검색), [상태 관리와 통합](./examples.md#상태-관리와-통합)

#### 옵션 (Options)

| Property        | 타입         | 설명                                                      |
| --------------- | ------------ | --------------------------------------------------------- |
| `initialValues` | `Partial<T>` | 초기 상태 값 (선택적, 비즈니스 로직 상태용, 맵 옵션 아님) |

#### 반환값

| Property   | 타입                                      | 설명                                             |
| ---------- | ----------------------------------------- | ------------------------------------------------ |
| `isReady`  | `boolean`                                 | Kakao Maps API 로드 완료 여부                    |
| `map`      | `KakaoMap \| null`                        | Map 인스턴스 (Map 컴포넌트 내부에서만 사용 가능) |
| `state`    | `T`                                       | 상태 객체 (React useState)                       |
| `setState` | `React.Dispatch<React.SetStateAction<T>>` | 상태 업데이트 함수 (React setState)              |

#### 좌표 관련

| Method          | 시그니처                                                                                           | 설명                   |
| --------------- | -------------------------------------------------------------------------------------------------- | ---------------------- |
| `parsePosition` | `(position: `[`KakaoPosition`](#kakaoposition)`) => KakaoLatLngInstance \| null`                   | 좌표 변환              |
| `getDistance`   | `(pos1: `[`KakaoPosition`](#kakaoposition)`, pos2: `[`KakaoPosition`](#kakaoposition)`) => number` | 두 지점 간 거리 (미터) |

#### 검색 함수

| Method          | 시그니처                                                                                              | 설명               |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| `searchAddress` | `(address: string) => Promise<KakaoSearchResult>`                                                     | 주소 → 좌표 검색   |
| `searchPlace`   | `(keyword: string) => Promise<KakaoPlaceResult[]>`                                                    | 키워드로 장소 검색 |
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

| Method         | 시그니처                                                                                          | 설명      |
| -------------- | ------------------------------------------------------------------------------------------------- | --------- |
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

### useMapContext

Map 컨텍스트에 접근하는 훅입니다. Map 컴포넌트 내부에서만 사용 가능합니다.

```tsx
import { useMapContext } from "@ehfuse/kakao-map";

function MyComponent() {
    const { map, selectedMarker, setSelectedMarker } = useMapContext();

    // selectedMarker: 현재 선택된 마커
    // setSelectedMarker: 마커 선택 상태 변경
}
```

#### 반환값

| Property            | 타입                                    | 설명                      |
| ------------------- | --------------------------------------- | ------------------------- |
| `map`               | `KakaoMap`                              | 지도 인스턴스             |
| `clusterer`         | `KakaoClusterer \| null`                | 클러스터러 인스턴스       |
| `selectedMarker`    | `KakaoMarker \| null`                   | 현재 선택된 마커          |
| `setSelectedMarker` | `(marker: KakaoMarker \| null) => void` | 선택된 마커 설정          |
| `isUnmountingRef`   | `MutableRefObject<boolean>`             | 언마운트 상태 (내부 사용) |

---

### useMarkerContext

Marker 컨텍스트에 접근하는 훅입니다. MapMarker 컴포넌트 내부에서만 사용 가능합니다.

```tsx
import { useMarkerContext } from "@ehfuse/kakao-map";

function InfoContent() {
    const { marker, position } = useMarkerContext();

    return (
        <div>
            <p>위도: {position.lat}</p>
            <p>경도: {position.lng}</p>
        </div>
    );
}

// MapMarker의 자식에서 사용
<MapMarker position={pos}>
    <CustomInfoWindow content={<InfoContent />} />
</MapMarker>;
```

#### 반환값

| Property   | 타입          | 설명                     |
| ---------- | ------------- | ------------------------ |
| `marker`   | `KakaoMarker` | 마커 인스턴스            |
| `position` | `KakaoLatLng` | 마커 위치 `{ lat, lng }` |

> **참고**: `useMarkerContext`는 MapMarker의 자식 컴포넌트에서만 사용할 수 있습니다. 외부에서 호출하면 에러가 발생합니다.

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

## 상태 관리

`useKakaoMap`은 선택적으로 React의 `useState`를 사용하여 비즈니스 로직 상태를 관리할 수 있습니다.

> ⚠️ **주의**: `initialValues`는 **비즈니스 로직 상태**를 위한 것입니다. 맵 옵션(`center`, `level` 등)은 `Map` 컴포넌트의 props로 전달하세요.

### 기본 사용 (API 유틸리티만)

```tsx
// 상태 관리 없이 API 유틸리티만 사용
const { isReady, searchAddress, searchPlace } = useKakaoMap();

// 주소 검색
const result = await searchAddress("서울시청");
console.log(result.lat, result.lng);
```

### 상태 관리와 함께 사용

```tsx
// 비즈니스 로직 상태 타입 정의
interface MyMapState {
    selectedPlace: { lat: number; lng: number; name: string } | null;
    markers: Array<{ id: string; position: { lat: number; lng: number } }>;
}

const { state, setState, searchAddress } = useKakaoMap<MyMapState>({
    initialValues: {
        selectedPlace: null,
        markers: [],
    },
});

// 값 읽기
const selectedPlace = state.selectedPlace;
const markers = state.markers;

// 값 쓰기
setState((prev) => ({
    ...prev,
    selectedPlace: {
        lat: 37.4979,
        lng: 127.0276,
        name: "강남역",
    },
}));

setState((prev) => ({
    ...prev,
    markers: [...prev.markers, newMarker],
}));

// 여러 값 동시 변경
setState((prev) => ({
    ...prev,
    selectedPlace: { lat: 37.4979, lng: 127.0276, name: "강남역" },
    markers: [...prev.markers, newMarker],
}));
```

### 효율적인 상태 관리

애플리케이션에서 **개별 필드 구독**을 통한 효율적인 리렌더링이 필요하다면, [@ehfuse/forma](https://github.com/ehfuse/forma)와 같은 상태 관리 라이브러리를 직접 사용하는 것을 권장합니다.

```tsx
import { useGlobalFormaState } from "@ehfuse/forma";
import { useKakaoMap } from "@ehfuse/kakao-map";

// forma로 상태 관리
const appState = useGlobalFormaState({
    stateId: "my-app",
    initialValues: {
        center: { lat: 37.5665, lng: 126.978 },
        selectedMarkerId: null,
    },
});

// useKakaoMap에서 API 유틸리티만 사용
const { searchAddress } = useKakaoMap();

// 개별 필드 구독 (해당 필드만 변경되면 리렌더링)
const center = appState.useValue("center");
const selectedMarkerId = appState.useValue("selectedMarkerId");

// 값 업데이트
appState.setValue("center", { lat: 37.4979, lng: 127.0276 });
appState.setValue("selectedMarkerId", 123);
```

---

## 더 알아보기

-   [시작하기](./getting-started.md) - 설치 및 기본 사용법
-   [예제 모음](./examples.md) - 다양한 사용 사례와 코드 예제
-   [GitHub 저장소](https://github.com/ehfuse/kakao-map) - 소스 코드 및 전체 예제
