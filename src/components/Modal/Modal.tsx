

interface ModalProps {
    children: React.ReactNode
    text: any
    onClick: () => void
}

export default function Modal({ children, text, onClick }: ModalProps) {

    return (
         <>
            <div
                className="fixed bg-black/50 inset-0 "  
                onClick={onClick}  
            />

            <div className="absolute p-5 px-10 w=[800px] rounded bg-white top-10 left-1/2 -translate-x-1/2">
                <h1 className="text-xl mb-3">{text}</h1>
                {children}
            </div>
        </>
    )
}