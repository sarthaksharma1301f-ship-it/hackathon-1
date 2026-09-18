import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    print("=" * 60)
    print(" ⚡ SparkGig — Creator Gig Marketplace (Hackathon MVP)")
    print("=" * 60)
    print(f" Serving directory: {DIRECTORY}")
    print(f" Local URL: http://localhost:{PORT}")
    print(" Press Ctrl+C to stop the server.")
    print("=" * 60)
    
    # Attempt to open browser automatically
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception:
        pass

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
