
export default function Player({ name, lvl }: { name: string, lvl: number }) {
    return (
        <>
            <div>
                <b className="accent-to-primary-text">{name}</b> <i className="font-normal">lvl {lvl}</i>
            </div>
        </>
    )
}