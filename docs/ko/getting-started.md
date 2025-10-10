# 시작하기

## 설치

```bash
npm install @ehfuse/kakao-map
# or
yarn add @ehfuse/kakao-map
# or
pnpm add @ehfuse/kakao-map
```

## Kakao API 키 발급

1. [Kakao Developers](https://developers.kakao.com/)에 접속하여 로그인
2. "내 애플리케이션" 메뉴에서 애플리케이션 추가
3. "플랫폼" → "Web" 추가
4. "JavaScript 키" 복사

## API 키 설정

### 방법 1: HTML에 스크립트 추가 (권장)

`index.html` 파일에 Kakao Maps SDK를 추가합니다:

```html
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Kakao Map App</title>
        <!-- Kakao Maps SDK -->
        <script
            type="text/javascript"
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services,clusterer,drawing"
        ></script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

### 방법 2: 동적 API 키 설정 (선택사항)

HTML에 스크립트를 추가하지 않고 동적으로 API 키를 설정할 수도 있습니다:

```tsx
import { Map } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            apiKey="YOUR_APP_KEY"
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        />
    );
}
```

> ⚠️ **프로덕션 환경에서는 방법 1을 권장합니다.**  
> Kakao Maps SDK는 `document.write()`를 사용하므로 동기 로딩이 필요합니다. HTML에서 직접 로드하면:
>
> -   React 앱 시작 전에 SDK가 준비됩니다
> -   로딩 상태 관리가 필요 없습니다
> -   더 안정적이고 빠른 초기 로딩이 가능합니다

---

## 기본 사용법

### 1. 간단한 지도 표시

```tsx
import { Map } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        />
    );
}

export default App;
```

### 2. 마커 추가

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        >
            <MapMarker
                position={{ lat: 37.5665, lng: 126.978 }}
                title="서울시청"
            />
        </Map>
    );
}
```

## useKakaoMap 훅 사용

지도 기능과 선택적 상태 관리를 위해 `useKakaoMap` 훅을 사용할 수 있습니다:

### API 유틸리티만 사용

```tsx
import { Map, MapMarker, useKakaoMap } from "@ehfuse/kakao-map";
import { useState } from "react";

function App() {
    const { searchAddress } = useKakaoMap();
    const [selectedPlace, setSelectedPlace] = useState<{
        lat: number;
        lng: number;
        name: string;
    } | null>(null);

    const handleSearch = async () => {
        const result = await searchAddress("서울시청");
        if (result) {
            setSelectedPlace({
                lat: result.lat,
                lng: result.lng,
                name: "서울시청",
            });
        }
    };

    return (
        <div>
            <button onClick={handleSearch}>서울시청 찾기</button>
            <Map
                center={
                    selectedPlace
                        ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
                        : { lat: 37.5665, lng: 126.978 }
                }
                level={3}
                style={{ width: "100%", height: "400px" }}
            >
                {selectedPlace && (
                    <MapMarker
                        position={{
                            lat: selectedPlace.lat,
                            lng: selectedPlace.lng,
                        }}
                        title={selectedPlace.name}
                    />
                )}
            </Map>
        </div>
    );
}
```

### 상태 관리와 함께 사용

```tsx
import { Map, MapMarker, useKakaoMap } from "@ehfuse/kakao-map";

// 비즈니스 로직 상태 타입 정의
interface MyMapState {
    selectedPlace: { lat: number; lng: number; name: string } | null;
    searchKeyword: string;
}

function App() {
    const { state, setState, searchAddress } = useKakaoMap<MyMapState>({
        initialValues: {
            selectedPlace: null,
            searchKeyword: "",
        },
    });

    const handleSearch = async () => {
        const result = await searchAddress("서울시청");
        if (result) {
            setState((prev) => ({
                ...prev,
                selectedPlace: {
                    lat: result.lat,
                    lng: result.lng,
                    name: "서울시청",
                },
            }));
        }
    };

    return (
        <div>
            <button onClick={handleSearch}>서울시청 찾기</button>
            <Map
                center={
                    state.selectedPlace
                        ? {
                              lat: state.selectedPlace.lat,
                              lng: state.selectedPlace.lng,
                          }
                        : { lat: 37.5665, lng: 126.978 }
                }
                level={3}
                style={{ width: "100%", height: "400px" }}
            >
                {state.selectedPlace && (
                    <MapMarker
                        position={{
                            lat: state.selectedPlace.lat,
                            lng: state.selectedPlace.lng,
                        }}
                        title={state.selectedPlace.name}
                    />
                )}
            </Map>
        </div>
    );
}
```

> 💡 **효율적인 상태 관리**: 개별 필드 구독이 필요한 복잡한 애플리케이션에서는 [@ehfuse/forma](https://github.com/ehfuse/forma) 같은 상태 관리 라이브러리를 사용하는 것을 권장합니다. 자세한 내용은 [API 레퍼런스](./api.md#상태-관리)를 참조하세요.

## 다음 단계

-   [API 레퍼런스](./api.md) - 모든 컴포넌트와 훅의 상세 API
-   [예제](./examples.md) - 다양한 사용 예제
-   [GitHub 저장소](https://github.com/ehfuse/kakao-map) - 소스 코드 및 이슈

## 문제 해결

### API 로드 오류

```
Uncaught ReferenceError: kakao is not defined
```

→ `index.html`에 Kakao Maps SDK 스크립트가 추가되었는지 확인하세요.

### TypeScript 오류

컴포넌트의 모든 props에 대한 타입 정의가 제공됩니다. IDE의 자동 완성을 활용하세요.

```tsx
import type { MapProps, MapMarkerProps } from "@ehfuse/kakao-map";
```
