/** 
 * @author luoz
 * 根据样本数据，构造一个平滑的曲面
 * 
 * X: 一维数组, ｘ 方向的分割点, 从小到大排列  (columns)
 * Y: 一维数组, y 方向的分割点, 从小到大排列  (rows)
 * Z: 二维数组, 格点上的采样值. (行列)
 *
 * 返回: 一个函数 f(x, y), x 为一维数组, x 方向上的新的分割点. y 为一维数组, y 方向上的新的分割点.
 *
 * 例如:
 * 
 * var f = interp2([1,2,3], [4,5], [[1.5, 2.1, 3], [0, 3, 1]]);
 * Z = f([1,1.5,2,2.5,3], [4,4.2,4.4,4.6,4.8,5])
 */
function interp2(X, Y, Z) {
    var A_INVERSE = [[1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
                        [-3 , 3 , 0 , 0 , -2 , -1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
                        [2 , -2 , 0 , 0 , 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , -3 , 3 , 0 , 0 , -2 , -1 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , -2 , 0 , 0 , 1 , 1 , 0 , 0 ],
                        [-3 , 0 , 3 , 0 , 0 , 0 , 0 , 0 , -2 , 0 , -1 , 0 , 0 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , -3 , 0 , 3 , 0 , 0 , 0 , 0 , 0 , -2 , 0 , -1 , 0 ],
                        [9 , -9 , -9 , 9 , 6 , 3 , -6 , -3 , 6 , -6 , 3 , -3 , 4 , 2 , 2 , 1 ],
                        [-6 , 6 , 6 , -6 , -3 , -3 , 3 , 3 , -4 , 4 , -2 , 2 , -2 , -2 , -1 , -1 ],
                        [2 , 0 , -2 , 0 , 0 , 0 , 0 , 0 , 1 , 0 , 1 , 0 , 0 , 0 , 0 , 0 ],
                        [0 , 0 , 0 , 0 , 2 , 0 , -2 , 0 , 0 , 0 , 0 , 0 , 1 , 0 , 1 , 0 ],
                        [-6 , 6 , 6 , -6 , -4 , -2 , 4 , 2 , -3 , 3 , -3 , 3 , -2 , -1 , -2 , -1 ],
                        [4 , -4 , -4 , 4 , 2 , 2 , -2 , -2 , 2 , -2 , 2 , -2 , 1 , 1 , 1 , 1]];

    function zeros1(n) {
        var a = [];

        for (var k = 0; k < n; k++) {
            a[k] = 0;
        }

        return a;
    }

    function zeros2(m, n) {
        var a = [];

        for (var k = 0; k < m; k++) {
            a[k] = zeros1(n);
        }

        return a;
    }

    function zeros3(m, n, p) {
        var a = [];

        for (var k = 0; k < m; k++) {
            a[k] = zeros2(n, p);
        }

        return a;
    }

    function mmulv16(A, x) {
        var y = zeros1(16);

        for (var i = 0; i < 16; i++) {
            var sum = 0;
            for (var j = 0; j < 16; j++) {
                sum += A[i][j] * x[j];
            }
            y[i] = sum;
        }

        return y;
    }

    var nrow = Y.length;
    var ncol = X.length;

    /*
    * 数据太少
    */
    if (nrow <= 1 || ncol <= 1) {
        return;
    }

    var z_zx_zy_zxy = zeros3(nrow, ncol, 4);
    var ALPHA = zeros3(nrow-1, ncol-1, 16);

    for (var i = 0; i < nrow; i++) {
        for (var j = 0; j < ncol; j++) {
            // z
            z_zx_zy_zxy[i][j][0] = Z[i][j];

            // z_x
            if (j == 0) {
                z_zx_zy_zxy[i][j][1] = Z[i][j+1] - Z[i][j]
            }  else if (j == ncol - 1) {
                z_zx_zy_zxy[i][j][1] = Z[i][j] - Z[i][j-1]
            } else {
                z_zx_zy_zxy[i][j][1] = (Z[i][j+1] - 2*Z[i][j] + Z[i][j-1])/2.0
            }
            
            // z_y
            if (i == 0) {
                z_zx_zy_zxy[i][j][2] = Z[i+1][j] - Z[i][j]
            } else if (i == nrow - 1) {
                z_zx_zy_zxy[i][j][2] = Z[i][j] - Z[i-1][j]
            } else {
                z_zx_zy_zxy[i][j][2] = (Z[i+1][j] - 2*Z[i][j] + Z[i-1][j])/2
            }

            // z_x_y
            if (i == 0 && j == 0) {
                z_zx_zy_zxy[i][j][3] = Z[i][j] + Z[i+1][j+1] - Z[i+1][j] - Z[i][j+1]
            } else if  (i == 0 && j == ncol - 1) {
                z_zx_zy_zxy[i][j][3] = Z[i][j] + Z[i+1][j-1] - Z[i+1][j] - Z[i][j-1]
            } else if  (i == nrow - 1 && j == 0) {
                z_zx_zy_zxy[i][j][3] = Z[i][j] + Z[i-1][j+1] - Z[i][j+1] - Z[i-1][j]
            } else if  (i == nrow - 1 && j == ncol - 1) {
                z_zx_zy_zxy[i][j][3] = Z[i][j] + Z[i-1][j-1] - Z[i][j-1] - Z[i-1][j]
            } else if  (j == 0) {
                z_zx_zy_zxy[i][j][3] = (2*Z[i][j] + Z[i+1][j+1] + Z[i-1][j+1] - 2*Z[i][j+1] - Z[i-1][j] - Z[i+1][j])/2.0
            } else if  (j == ncol - 1) {
                z_zx_zy_zxy[i][j][3] = (2*Z[i][j] + Z[i+1][j-1] + Z[i-1][j-1] - 2*Z[i][j-1] - Z[i-1][j] - Z[i+1][j])/2.0
            } else if  (i == 0) {
                z_zx_zy_zxy[i][j][3] = (2*Z[i][j] + Z[i+1][j-1] + Z[i+1][j+1] - 2*Z[i+1][j] - Z[i][j-1] - Z[i][j+1])/2.0
            } else if  (i == nrow - 1) {
                z_zx_zy_zxy[i][j][3] = (2*Z[i][j] + Z[i-1][j-1] + Z[i-1][j+1] - 2*Z[i-1][j] - Z[i][j-1] - Z[i][j+1])/2.0
            } else {
                z_zx_zy_zxy[i][j][3] = (4*Z[i][j] + (Z[i-1][j-1] + Z[i-1][j+1] + Z[i+1][j-1] + Z[i+1][j+1]) - 2 *(Z[i][j-1] + Z[i][j+1] + Z[i-1][j] + Z[i+1][j]))/4.0
            }
        }
    }

    for (var i = 0; i < nrow - 1; i++) {
        for (var j = 0; j < ncol - 1; j++) {
            x = zeros1(16)

            x[0] = z_zx_zy_zxy[i][j][0]
            x[1] = z_zx_zy_zxy[i][j+1][0]
            x[2] = z_zx_zy_zxy[i+1][j][0]
            x[3] = z_zx_zy_zxy[i+1][j+1][0]

            x[4] = z_zx_zy_zxy[i][j][1]
            x[5] = z_zx_zy_zxy[i][j+1][1]
            x[6] = z_zx_zy_zxy[i+1][j][1]
            x[7] = z_zx_zy_zxy[i+1][j+1][1]

            x[8] = z_zx_zy_zxy[i][j][2]
            x[9] = z_zx_zy_zxy[i][j+1][2]
            x[10] = z_zx_zy_zxy[i+1][j][2]
            x[11] = z_zx_zy_zxy[i+1][j+1][2]

            x[12] = z_zx_zy_zxy[i][j][3]
            x[13] = z_zx_zy_zxy[i][j+1][3]
            x[14] = z_zx_zy_zxy[i+1][j][3]
            x[15] = z_zx_zy_zxy[i+1][j+1][3]

            ALPHA[i][j] = mmulv16(A_INVERSE, x)
        }
    }

    function _interp2(x, y) {
        var len_x = x.length;
        var len_y = y.length;
        var Z = zeros2(len_y, len_x);

        for (var i = 0; i < len_x; i++) {
            var xi = 0;
            while (xi < ncol - 1) {
                if (X[xi] <= x[i] && X[xi+1] >= x[i]) {
                    break;
                }

                xi += 1;
            }

            xi = Math.min(xi, ncol-2)
            xt = (x[i] - X[xi]) / (X[xi+1] - X[xi])
            xt = Math.min(1, Math.max(xt, 0))

            for (var j = 0; j < len_y; j++) {
                var yj = 0;
                while (yj < nrow - 1) {
                    if (Y[yj] <= y[j] && Y[yj+1] >= y[j]) {
                        break;
                    }

                    yj += 1;
                }

                yj = Math.min(yj, nrow-2)
                yt = (y[j] - Y[yj]) / (Y[yj+1] - Y[yj])
                yt = Math.min(1, Math.max(yt, 0))

                var xt2 = xt * xt;
                var xt3 = xt2 * xt;
                var alpha = ALPHA[yj][xi];
                Z[j][i] = (alpha[0] + alpha[1] * xt + alpha[2] * xt2 + alpha[3] * xt3) 
                    + (alpha[4] + alpha[5] * xt + alpha[6] * xt2 + alpha[7] * xt3) * yt 
                    + (alpha[8] + alpha[9] * xt + alpha[10] * xt2 + alpha[11] * xt3) * yt * yt 
                    + (alpha[12] + alpha[13] * xt + alpha[14] * xt2 + alpha[15] * xt3) * yt * yt * yt;
            }
        }

        return Z;
    }

    return _interp2;
}