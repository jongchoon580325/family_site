export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-blue-500 bg-black py-12">
            <div className="container mx-auto px-4 text-center space-y-4">
                <p className="font-serif text-base text-gray-400">
                    A family of faith that serves God until Jesus Christ returns.
                </p>
                <p className="font-sans text-sm text-green-500">
                    Copyright ⓒ 1924~{currentYear}, <br className="md:hidden" />
                    예수 그리스도께서 다시 오실 때까지 창조주 하나님만 섬기는 가정.
                </p>
            </div>
        </footer>
    );
}
