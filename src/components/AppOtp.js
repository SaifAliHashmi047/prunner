import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { heightPixel, widthPixel, fontPixel } from '../services/constant';
import { colors } from '../services/utilities/colors';



const CELL_COUNT = 6;


const AppOtp = ({ value: controlledValue, onChange }) => {
    const [internalValue, setInternalValue] = useState('');
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const setValue = onChange || setInternalValue;
    
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    useEffect(() => {
        // You can handle the OTP value here
        console.log('OTP Value:', value);
    }
        , [value]);

    return (
        <View>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={style.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        key={index}
                        style={[style.cell, isFocused && style.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}
                    >
                        <Text style={style.cellText}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const style = StyleSheet.create({
    codeFieldRoot: {
        marginBottom: heightPixel(24),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cell: {
        width: widthPixel(40),
        height: widthPixel(40),
        borderRadius: widthPixel(8),
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        fontSize: fontPixel(18),
        color: colors.black,
    },
    focusCell: {
        borderWidth: 1,
        borderColor: colors.themeColor,
    },
})

export default AppOtp