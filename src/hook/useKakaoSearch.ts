/**
 * MIT License
 *
 * Copyright (c) 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { KakaoSearchResult } from "../types";
import { searchAddress } from "../utils";

/**
 * Map 컴포넌트 내에서 사용 가능한 주소 검색 훅
 * @param onSuccess 검색 성공 시 콜백
 * @param onError 검색 실패 시 콜백
 */
export const useKakaoSearch = (
    onSuccess?: (result: KakaoSearchResult) => void,
    onError?: (error: string) => void
) => {
    const search = (address: string) => {
        if (!address) return;

        searchAddress(
            address,
            (result) => {
                if (onSuccess) onSuccess(result);
            },
            (error) => {
                if (onError) onError(error);
            }
        );
    };

    return { search };
};
