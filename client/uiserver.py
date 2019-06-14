import SimpleHTTPServer
import SocketServer
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
os.chdir(dir_path)

PORT = 80

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving UI at port", PORT
httpd.serve_forever()

