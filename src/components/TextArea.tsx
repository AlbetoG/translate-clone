import React from "react";
import { Form } from "react-bootstrap";
import { SectionType } from "../types.d";

// type Props =
//     | { type: SectionType.From, loading?: undefined, onChange: (value: string) => void, value: string }
//     | { type: SectionType.To, loading?: boolean, onChange: (value: string) => void, value: string }

interface Props {
    type: SectionType
    value: string
    loading?: boolean
    autoFocus?: boolean
    onChange: (value: string) => void
}
const commonStyles = {
    border: 0,
    height: "200px",
    resize: 'none'
}

const getPlaceholderv = ({ type, loading }: { type: SectionType, loading?: boolean }) => {
    if (type == SectionType.From) return 'Introducir texto'
    if (loading === true) return 'Traduciendo...'
    return 'Traducción'
}


export const TextArea: React.FC<Props> = ({ type, value, loading, onChange }) => {
    const styles = type === SectionType.From ? commonStyles : { ...commonStyles, backgroundColor: "#f5f5f5" }
    const handdleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value)
    }

    return (
        <Form.Control
            as='textarea'
            disabled={type === SectionType.To ? true : false}
            placeholder={getPlaceholderv({ type, loading })}
            autoFocus={type === SectionType.From}
            style={styles}
            value={value}
            onChange={handdleChange}
        />
    )
}